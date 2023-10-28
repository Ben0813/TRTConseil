import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const token = localStorage.getItem('token');

const ProfileConsultant = () => {
  const [name, setName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token") !== null;
    const hasConsultantRole = localStorage.getItem("role") === "consultant";
    if (!isAuthenticated || !hasConsultantRole) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:3001/api/consultants'; 
    try {
      const response = await axios.put(url, {
        name,
        firstname,
        email
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Profil mis à jour avec succès:', response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 min-h-screen text-white">
      <div className="mb-8 flex justify-end">
        <button
          className="bg-raisin hover:bg-red text-white py-2 px-4 rounded font-rajdhani"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </div>
      <div className="bg-gray-800 p-8 rounded-lg w-full md:w-1/3 my-8">
        <h1 className="text-2xl mb-5">Mettre à jour le profil</h1>
        <form onSubmit={handleUpdateProfile}>
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded bg-gray-700 w-full mb-4"
          />
          <input
            type="text"
            placeholder="Prénom"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="p-2 rounded bg-gray-700 w-full mb-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded bg-gray-700 w-full mb-4"
          />
          <button type="submit" className="bg-green-500 p-2 rounded w-full">Mettre à jour</button>
        </form>
      </div>
    </div>
  );
}

export default ProfileConsultant;
