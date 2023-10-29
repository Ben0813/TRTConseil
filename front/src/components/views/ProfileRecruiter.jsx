import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const token = localStorage.getItem('token');


const ProfileRecruiter = () => {
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [recruiterId, setRecruiterId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token") !== null;
    const hasRecruiterRole = localStorage.getItem("role") === "recruiter";
    console.log("Is Authenticated:", isAuthenticated);
    console.log("Has Recruiter Role:", hasRecruiterRole);
    if (!isAuthenticated || !hasRecruiterRole) {
      console.log("Redirecting to Home");
      navigate("/");
    }
  }, [navigate]);
  
  const handleLogout = () => {
    //remove authentication info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    //redirect to logout page
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

    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des jobs:', error);
      }
    };

    fetchRecruiterId();
    fetchJobs();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/candidates');
      setCandidates(response.data);
      console.log('Candidats récupérés:', response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des candidats:', error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleJobChange = (e) => {
    const jobId = e.target.value;
    setSelectedJob(jobId);
    fetchCandidates(jobId);
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    const payload = {
      title: jobTitle,
      location: jobLocation,
      description: jobDescription,
      id_recruiter: recruiterId
    };
    try {
      const response = await axios.post('http://localhost:3001/api/jobs', payload);
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
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="w-full mb-3 p-2 border rounded"
            type="text"
            placeholder="Nom de l'entreprise"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            className="w-full mb-3 p-2 border rounded"
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
            className="w-full mb-3 p-2 border rounded"
            type="text"
            placeholder="Intitulé du poste"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <input
            className="w-full mb-3 p-2 border rounded"
            type="text"
            placeholder="Lieu de travail"
            value={jobLocation}
            onChange={(e) => setJobLocation(e.target.value)}
          />
          <textarea
            className="w-full mb-3 p-2 border rounded"
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
          {candidates.map((candidate, index) => (
            <li key={index} className="text-white border-b pb-2 pt-2">
              {candidate.name} a postulé pour {candidate.jobTitle}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
};

export default ProfileRecruiter;
