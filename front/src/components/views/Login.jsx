import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('candidate'); // Nouveau state pour le type d'utilisateur

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endPoint = `http://localhost:3001/api/${userType}s/login`; // Point de terminaison dynamique basé sur le type d'utilisateur
      const response = await axios.post(endPoint, {
        email,
        password,
      });
      
      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);
  
      // Redirection en fonction du type d'utilisateur
      if (userType === 'candidate') {
        navigate('/profile-candidate');
      } else if (userType === 'recruiter') {
        navigate('/profile-recruiter');
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
    <div>
      <form onSubmit={handleLogin}>
        {/* Menu déroulant pour le type d'utilisateur */}
        <select onChange={(e) => setUserType(e.target.value)} value={userType}>
          <option value="candidate">Candidat</option>
          <option value="recruiter">Recruteur</option>
          <option value="administrator">Administrateur</option>
          <option value="consultant">Consultant</option>
        </select>
        
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
      <button onClick={() => navigate('/signup-administrator')}>Créer un compte Administrateur</button>
      <button onClick={() => navigate('/signup-consultant')}>Créer un compte Consultant</button>
    </div>
  );
}

export default Login;
