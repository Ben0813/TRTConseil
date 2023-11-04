import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileRecruiter = () => {
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [jobLocation, setJobLocation] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [recruiterId, setRecruiterId] = useState(localStorage.getItem('id'));
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("token") !== null;
        const hasRecruiterRole = localStorage.getItem("role") === "recruiter";
        if (!isAuthenticated || !hasRecruiterRole) {
            navigate("/");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    useEffect(() => {
        const fetchRecruiterId = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/recruiters');
                setRecruiterId(response.data[0].id);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'ID du recruteur:', error);
            }
        };

        fetchRecruiterId();
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/jobs');
                setJobs(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des jobs:', error);
            }
        };

        fetchJobs();
    }, [recruiterId]);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/candidates');
                setCandidates(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des candidats:', error);
            }
        };

        fetchCandidates();
    }, []);

    useEffect(() => {
        if (!recruiterId) return;

        const fetchJobsByRecruiter = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/jobs/byRecruiter/${recruiterId}`);
                const jobsWithPostulations = await Promise.all(
                    response.data.map(async job => {
                        try {
                            const postulationsResponse = await axios.get(`http://localhost:3001/api/postulations/byJob/${job.id}`);
                            return {
                                ...job,
                                postulations: postulationsResponse.data || []
                            };
                        } catch (error) {
                            console.error(`Erreur lors de la récupération des postulations pour le job ${job.id}:`, error);
                            setError(`Erreur lors de la récupération des postulations pour le job ${job.id}.`);
                            return { ...job, postulations: [] };
                        }
                    })
                );
                setJobs(jobsWithPostulations);
            } catch (error) {
                console.error('Erreur lors de la récupération des jobs par recruteur:', error);
                setError('Erreur lors de la récupération des jobs.');
            }
        };

        fetchJobsByRecruiter();
    }, [recruiterId]);


  const updateRecruiterProfile = async () => {
    try {
      const payload = {
        company: companyName,
        address: address
      };
      const response = await axios.put(`http://localhost:3001/api/recruiters/${recruiterId}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        console.log("Profil de recruteur mis à jour avec succès", response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil de recruteur:", error);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateRecruiterProfile();
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    const payload = {
      title: jobTitle,
      location: jobLocation,
      description: jobDescription,
      id_recruiter: recruiterId,
      isApproved: false
    };
    try {
      const response = await axios.post('http://localhost:3001/api/jobs', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Annonce publiée avec succès:', response.data);
    } catch (error) {
      console.error('Erreur lors de la publication de l\'annonce:', error);
    }
  };

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
      <div className="bg-gray-800 p-5 rounded shadow-lg w-full md:w-1/2 mx-auto">
        <h1 className="text-white text-2xl mb-5">Compléter votre profil</h1>
        <form onSubmit={handleUpdateProfile}>
        <input
            className="text-black w-full mb-3 p-2 border rounded"
            type="text"
            placeholder="Nom de l'entreprise"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            className="text-black w-full mb-3 p-2 border rounded"
            type="text"
            placeholder="Adresse"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button className="bg-green-500 text-white p-2 rounded" type="submit">Mettre à jour</button>
        </form>
      </div>
      <div className="bg-gray-800 p-5 rounded shadow-lg w-full md:w-1/2 mx-auto mt-10">
        <h1 className="text-white text-2xl mb-5">Publier une annonce</h1>
        <form onSubmit={handleJobPost}>
          <input
            className="text-black w-full mb-3 p-2 border rounded"
            type="text"
            placeholder="Intitulé du poste"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <input
            className="text-black w-full mb-3 p-2 border rounded"
            type="text"
            placeholder="Lieu de travail"
            value={jobLocation}
            onChange={(e) => setJobLocation(e.target.value)}
          />
          <textarea
            className="text-black w-full mb-3 p-2 border rounded"
            placeholder="Description détaillée"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <button className="bg-green-500 text-white p-2 rounded" type="submit">Publier</button>
        </form>
      </div>
  
      <div className="bg-gray-800 p-5 rounded shadow-lg w-full md:w-1/2 mx-auto mt-10">
    <h1 className="text-white text-2xl mb-5">Candidats ayant postulé</h1>
    <ul>
                        {jobs.map((job) =>
                        Array.isArray(job.postulations) ? (
                            job.postulations.map((postulation) => (
                                <li key={postulation.id} className="mb-4">
                                    Candidat : {postulation.candidate.name}, a postulé pour le Job : {job.title}
                                </li>
                            ))
                        ) : (
                            <li key={job.id} className="mb-4">
                                {job.title}
                            </li>
                        )
                    )}
    </ul>
</div>
    </div>
  );
};

export default ProfileRecruiter;