import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Supposons que vous utilisez axios pour les requêtes HTTP

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/candidates/login', {
        email,
        password,
      });
      
      const { userType, token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);
  
      if (userType === 'candidate') {
        navigate('/profile-candidate');
      } else if (userType === 'recruiter') {
        // Redirigez vers la page du recruteur
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Se connecter</button>
      </form>

      <button onClick={() => navigate('/signup-candidate')}>Créer un compte Candidat</button>
      <button onClick={() => navigate('/signup-recruiter')}>Créer un compte Recruteur</button>
    </div>
  );
}

export default Login;
