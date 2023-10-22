import React, { useEffect } from 'react';
import axios from 'axios';

const ProfileCandidate = () => {
  const [name, setName] = React.useState("");
  const [firstname, setFirstname] = React.useState("");
  const [cv, setCv] = React.useState(null);

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCv(file);
    } else {
      alert("Seul le format PDF est accepté pour le CV.");
    }
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
      <div className="bg-gray-800 p-8 rounded-lg w-full md:w-1/3 my-8">
        <form>
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
