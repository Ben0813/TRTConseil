import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * ProfileRecruiter component manages recruiter profiles, job postings,
 * and displays candidates who have applied for jobs.
 */
const ProfileRecruiter = () => {
  // State hooks for various recruiter and job details
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [recruiterId, setRecruiterId] = useState(localStorage.getItem("id"));
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // State hooks to handle update and post status messages
  const [updateStatus, setUpdateStatus] = useState("");
  const [postStatus, setPostStatus] = useState("");

  const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;

  // Effect hook to verify authentication and role before component mounts
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token") !== null;
    const hasRecruiterRole = localStorage.getItem("role") === "recruiter";
    // If not authenticated or not a recruiter, redirect to home page
    if (!isAuthenticated || !hasRecruiterRole) {
      navigate("/");
    }
  }, [navigate]);

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  // Fetches the ID of the recruiter from the API
  useEffect(() => {
    const fetchRecruiterId = async () => {
      const url = `${baseUrl}/api/recruiters`;
      try {
        const response = await axios.get(url);
        setRecruiterId(response.data[0].id);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'ID du recruteur:",
          error
        );
      }
    };

    fetchRecruiterId();
  }, []);

  // Fetches the list of jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      const url = `${baseUrl}/api/jobs`;
      try {
        const response = await axios.get(url);
        setJobs(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des jobs:", error);
      }
    };

    fetchJobs();
  }, [recruiterId]);

  // Fetches the list of candidates from the API
  useEffect(() => {
    const fetchCandidates = async () => {
      const url = `${baseUrl}/api/candidates`;
      try {
        const response = await axios.get(url);
        setCandidates(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des candidats:", error);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    if (!recruiterId) return;

    // Fetches jobs by the recruiter and their associated postulations
    const fetchJobsByRecruiter = async () => {
      const url = `${baseUrl}/api/jobs/byRecruiter/${recruiterId}`;
      try {
        const response = await axios.get(url);
        const jobsWithPostulations = await Promise.all(
          response.data.map(async (job) => {
            const url = `${baseUrl}/api/postulations/byJob/${job.id}`;
            try {
              const postulationsResponse = await axios.get(url);
              return {
                ...job,
                postulations: postulationsResponse.data || [],
              };
            } catch (error) {
              console.error(
                `Erreur lors de la récupération des postulations pour le job ${job.id}:`,
                error
              );
              setError(
                `Erreur lors de la récupération des postulations pour le job ${job.id}.`
              );
              return { ...job, postulations: [] };
            }
          })
        );
        setJobs(jobsWithPostulations);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des jobs par recruteur:",
          error
        );
        setError("Erreur lors de la récupération des jobs.");
      }
    };

    fetchJobsByRecruiter();
  }, [recruiterId]);

  // Function to update the recruiter's profile
  const updateRecruiterProfile = async () => {
    const url = `${baseUrl}/api/recruiters/${recruiterId}`;
    try {
      const payload = {
        company: companyName,
        address: address,
      };
      const response = await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        setUpdateStatus("Profil mis à jour avec succès.");
      }
    } catch (error) {
      setUpdateStatus(
        "Erreur lors de la mise à jour du profil. Veuillez réessayer."
      );
      console.error(
        "Erreur lors de la mise à jour du profil de recruteur:",
        error
      );
    }
  };

  // Function to handle form submission for profile updates
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateRecruiterProfile();
  };

  // Function to handle job posting
  const handleJobPost = async (e) => {
    e.preventDefault();
    const url = `${baseUrl}/api/jobs`;
    const payload = {
      title: jobTitle,
      location: jobLocation,
      description: jobDescription,
      id_recruiter: recruiterId,
      isApproved: false,
    };
    try {
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 201) {
        setPostStatus("Annonce publiée avec succès.");
      }
    } catch (error) {
      setPostStatus(
        "Erreur lors de la publication de l'annonce. Veuillez réessayer."
      );
      console.error("Erreur lors de la publication de l'annonce:", error);
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
          <p className="text-yellow-300">{updateStatus}</p>
          <button className="bg-green-500 text-white p-2 rounded" type="submit">
            Mettre à jour
          </button>
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
          <p className="text-yellow-300">{postStatus}</p>
          <button className="bg-green-500 text-white p-2 rounded" type="submit">
            Publier
          </button>
        </form>
      </div>

      <div className="bg-gray-800 p-5 rounded shadow-lg w-full md:w-1/2 mx-auto mt-10">
        <h1 className="text-white text-2xl mb-5">Candidats ayant postulé</h1>
        <ul>
          {jobs.map((job) =>
            Array.isArray(job.postulations) ? (
              job.postulations.map((postulation) => (
                <li key={postulation.id} className="mb-4">
                  Candidat : {postulation.candidate.name}, a postulé pour le Job
                  : {job.title}
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
