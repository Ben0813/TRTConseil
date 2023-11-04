import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const token = localStorage.getItem('token');

const ProfileAdministrator = () => {
  const [name, setName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const resetForm = () => {
    setName('');
    setFirstname('');
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token") !== null;
    const hasAdminRole = localStorage.getItem("role") === "administrator";
    if (!isAuthenticated || !hasAdminRole) {
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

  const handleCreateConsultant = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:3001/api/consultants';
    try {
      const response = await axios.post(url, {
        name,
        firstname,
        email,
        password
      });
      alert('Compte créé avec succès. trop fort chef !');
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      alert('Erreur lors de la création du compte. Veuillez réessayer.');
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
        <h1 className="text-2xl mb-5">Créer un compte consultant</h1>
        <form onSubmit={handleCreateConsultant}>
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
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-gray-700 w-full mb-4"
          />
          <button type="submit" className="bg-green-500 p-2 rounded w-full">Créer</button>
        </form>
      </div>
    </div>
  );
}

export default ProfileAdministrator;
