import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('candidate');

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("trying to log with", email, password, userType);
    try {
      const endPoint = `http://localhost:3001/api/${userType}s/login`;
      const response = await axios.post(endPoint, {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', userType);
      localStorage.setItem('userType', userType);

      if (userType === 'candidate') {
        console.log("Navigation to profile-candidate");
        navigate('/profile-candidate');
        console.log("Should have navigated to profile-candidate");
      } else if (userType === 'recruiter') {
        console.log("Navigation to profile-recruiter");
        navigate('/profile-recruiter');
        console.log("Should have navigated to profile-recruiter");
      } else if (userType === 'administrator') {
        navigate('/profile-administrator');
      } else if (userType === 'consultant') {
        navigate('/profile-consultant');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg w-full max-w-xs mb-8">
        <form onSubmit={handleLogin}>
          <label className="block text-white mb-2">Type d'utilisateur</label>
          <select onChange={(e) => setUserType(e.target.value)} value={userType} className="w-full bg-gray-700 text-white p-2 rounded mb-4">
            <option value="candidate">Candidat</option>
            <option value="recruiter">Recruteur</option>
            <option value="administrator">Administrateur</option>
            <option value="consultant">Consultant</option>
          </select>

          <label className="block text-white mb-2">Email</label>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded mb-4" />

          <label className="block text-white mb-2">Mot de passe</label>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded mb-4" />

          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded">Se connecter</button>
        </form>
      </div>

      <div className="flex flex-col sm:flex-row justify-between w-full max-w-xs sm:max-w-lg mx-auto">
        <button onClick={() => navigate('/signup-candidate')} className="bg-gray-700 text-white p-3 rounded mb-2 sm:mb-0 sm:mr-2">
          Créer Candidat
        </button>
        <button onClick={() => navigate('/signup-recruiter')} className="bg-gray-700 text-white p-3 rounded mb-2 sm:mb-0 sm:mr-2">
          Créer Recruteur
        </button>
        <button onClick={() => navigate('/signup-administrator')} className="bg-gray-700 text-white p-3 rounded mb-2 sm:mb-0 sm:mr-2">
          Créer Administrateur
        </button>
        <button onClick={() => navigate('/signup-consultant')} className="bg-gray-700 text-white p-3 rounded mb-2 sm:mb-0">
          Créer Consultant
        </button>
      </div>
    </div>
  );
};

export default Login;

