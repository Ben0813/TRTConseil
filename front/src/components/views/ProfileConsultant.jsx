import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileConsultant = () => {
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [pendingJobs, setPendingJobs] = useState([]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token") !== null;
    const hasConsultantRole = localStorage.getItem("role") === "consultant";
    if (!isAuthenticated || !hasConsultantRole) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchPendingAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/pending-accounts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPendingAccounts(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des comptes en attente:', error);
      }
    };

    fetchPendingAccounts();
  }, [token]);

  useEffect(() => {
    const fetchPendingJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/pending-jobs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPendingJobs(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des jobs en attente:', error);
      }
    };

    fetchPendingJobs();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const toggleApproval = async (id, type, isApproved) => {
    try {
      const response = await axios.put('http://localhost:3001/api/approve-account', {
        id,
        type,
        isApproved: !isApproved
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        setPendingAccounts(pendingAccounts.map(account => 
          account.id === id ? { ...account, isApproved: !isApproved } : account
        ));
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation du compte:', error);
    }
  };
  
  const toggleJobApproval = async (id, isApproved) => {
    try {
      const response = await axios.put('http://localhost:3001/api/approve-job', {
        id,
        isApproved: !isApproved
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        setPendingJobs(pendingJobs.map(job => 
          job.id === id ? { ...job, isApproved: !isApproved } : job
        ));
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation du job:', error);
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
      <div className="bg-gray-800 p-8 rounded-lg w-full md:w-1/3 my-8">
        <h1 className="text-2xl mb-5">Comptes en attente de validation</h1>
        <ul className="list-inside list-disc">
          {pendingAccounts.map((account) => {
            const buttonColor = account.isApproved ? "bg-green-500" : "bg-red-500";
            const buttonText = account.isApproved ? "Approuvé" : "Non approuvé";
            return (
              <li key={`${account.id}-${account.type}`} className="mb-4">
                {account.email} ({account.type})
                <button 
                  className={`${buttonColor} hover:bg-green-700 text-white py-1 px-2 rounded ml-2`}
                  onClick={() => toggleApproval(account.id, account.type, account.isApproved)}
                >
                  {buttonText}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="bg-gray-800 p-8 rounded-lg w-full md:w-1/3 my-8">
        <h1 className="text-2xl mb-5">Jobs en attente de validation</h1>
        <ul className="list-inside list-disc">
          {pendingJobs.map((job) => {
          const buttonColor = job.isApproved ? "bg-green-500" : "bg-red-500";
          const buttonText = job.isApproved ? "Approuvé" : "Non approuvé";
          return (
            <li key={job.id} className="mb-4">
              {job.title}
              <button 
                className={`${buttonColor} hover:bg-green-700 text-white py-1 px-2 rounded ml-2`}
                onClick={() => toggleJobApproval(job.id, job.isApproved)}
             >
              {buttonText}
            </button>
          </li>
        );
      })}
    </ul>
  </div>
    </div>
  );
};


export default ProfileConsultant;
