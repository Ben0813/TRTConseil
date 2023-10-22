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
    // Votre logique pour postuler à un job ici
    console.log(`Postulé au job avec l'ID: ${jobId}`);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/candidates', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Faites quelque chose avec les données ici, par exemple, mettez à jour l'état.
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
    // ...
  ];

  return (
    <div>
      <div id="profile-section">
        <form>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Nom" 
          />
          <input 
            type="text" 
            value={firstname} 
            onChange={e => setFirstname(e.target.value)} 
            placeholder="Prénom" 
          />
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleCvUpload} 
          />
          <button type="submit">Mettre à jour</button>
        </form>
      </div>
      <div id="jobs-section">
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              {job.title} <button onClick={() => handleApply(job.id)}>Postuler</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProfileCandidate;
