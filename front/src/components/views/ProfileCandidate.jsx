import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileCandidate = () => {
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [cv, setCv] = useState(null);
  const [id, setId] = useState(localStorage.getItem("id"));
  const [approvedJobs, setApprovedJobs] = useState([]);
  const formRef = useRef(null);
  const [isApplied, setIsApplied] = useState({});

  const resetForm = () => {
    setName('');
    setFirstname('');
    formRef.current.reset();
  };
  
  
  console.log("ID depuis le localStorage dans ProfileCandidate: ", localStorage.getItem('id'));

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token") !== null;
    const hasCandidateRole = localStorage.getItem("role") === "candidate";
    if (!isAuthenticated || !hasCandidateRole) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchApprovedJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/approved-jobs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setApprovedJobs(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des jobs validés:', error);
      }
    };
  
    fetchApprovedJobs();
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    navigate("/");
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCv(file);
    } else {
      alert("Seul le format PDF est accepté pour le CV.");
    }
  };

  const updateProfile = async (id, dataToUpdate) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/candidates/${id}`, dataToUpdate, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.status === 200) {
        alert('Votre profil a été mis à jour avec succès.');
        resetForm();
        console.log("Profil mis à jour avec succès", response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      alert('Erreur lors de la mise à jour du profil. Veuillez réessayer.');
    }
  };
  
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("firstname", firstname);
    formData.append("cv", cv);
    
    if (!id) {
      console.error("ID n'est pas défini. Impossible de continuer.");
      return;
    }
  
    updateProfile(id, formData);
  };
  
  
  const handleApply = async (jobId) => {
    console.log('Tentative de postulation pour le job:', jobId); 
  
    try {
      const response = await axios.post('http://localhost:3001/api/postulations', {
        id_candidate: id,
        id_job: jobId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      console.log('Réponse du serveur:', response); 
  
      if (response.status >= 200 && response.status < 300) {
        alert('Vous avez postulé avec succès à l\'emploi.');
        setIsApplied(prev => ({ ...prev, [jobId]: true }));
      } else {
        console.error('Réponse du serveur non attendue:', response);
      }
    } catch (error) {
      console.error('Erreur lors de la postulation:', error);
      alert('Erreur lors de la postulation. Veuillez réessayer.');
    }
  };
  
  
  
  

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/candidates', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-900 min-h-screen text-white">
      <div className="mb-8 flex justify-end w-full p-4">
        <button
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </div>
      <div className="bg-gray-800 p-8 rounded-lg w-full md:w-1/3 my-8">
      <form ref={formRef} onSubmit={handleFormSubmit}>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Nom"
            className="p-2 rounded bg-gray-700 w-full mb-4" 
          />
          <input 
            type="text" 
            value={firstname} 
            onChange={e => setFirstname(e.target.value)} 
            placeholder="Prénom"
            className="p-2 rounded bg-gray-700 w-full mb-4" 
          />
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleCvUpload} 
            className="p-2 rounded bg-gray-700 w-full mb-4"
          />
           <button type="submit" className="bg-green-500 p-2 rounded w-full">Mettre à jour</button>
        </form>
      </div>
      <div className="bg-gray-800 p-8 rounded-lg w-full md:w-1/3 my-8">
  <h1 className="text-2xl mb-5">Jobs validés</h1>
  <ul className="list-inside list-disc">
    {approvedJobs.map((job) => (
    <li key={job.id} className="mb-4">
    <div>
      <strong>Titre : </strong> {job.title}
    </div>
    <div>
      <strong>Description : </strong> {job.description}
    </div>
    <div>
      <strong>Lieu : </strong> {job.location}
    </div>
    <div>
    <button
  className={`bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded ml-2 ${isApplied[job.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
  onClick={() => handleApply(job.id)}
  disabled={isApplied[job.id]} >
  {isApplied[job.id] ? 'Postulation envoyée' : 'Postuler'}
</button>

    </div>
      </li>
    ))}
  </ul>
</div>

</div>
  );
};

export default ProfileCandidate;