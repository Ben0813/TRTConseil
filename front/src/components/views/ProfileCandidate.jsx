import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileCandidate = () => {
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [cv, setCv] = useState(null);
  const [id, setId] = useState(localStorage.getItem("id"));
  console.log("État actuel de name:", name);
console.log("État actuel de firstname:", firstname);
console.log("État actuel de cv:", cv);

  
  
  console.log("ID depuis le localStorage dans ProfileCandidate: ", localStorage.getItem('id'));

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token") !== null;
    const hasCandidateRole = localStorage.getItem("role") === "candidate";
    if (!isAuthenticated || !hasCandidateRole) {
      navigate("/");
    }
  }, [navigate]);

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
        console.log("Profil mis à jour avec succès", response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
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
  
  
  const handleApply = (jobId) => {
    console.log(`Postulé au job avec l'ID: ${jobId}`);
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

  const jobs = [
    { id: 1, title: "Développeur Frontend" },
    { id: 2, title: "Développeur Backend" },
  ];

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
      <form onSubmit={handleFormSubmit}>
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
        <ul>
          {jobs.map((job) => (
            <li key={job.id} className="flex justify-between mb-4">
              <span>{job.title}</span> 
              <button onClick={() => handleApply(job.id)} className="bg-blue-500 p-2 rounded">Postuler</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProfileCandidate;
