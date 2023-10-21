import React, { useState } from 'react';
import axios from 'axios';

const SignupCandidate = () => {
  const [name, setName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cv, setCv] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:3001/api/candidates';
    try {
      const response = await axios.post(url, {
        name,
        firstname,
        email,
        password,
        cv
      });
      console.log('Compte créé avec succès:', response.data);
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Prénom"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="CV"
          value={cv}
          onChange={(e) => setCv(e.target.value)}
        />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}

export default SignupCandidate;