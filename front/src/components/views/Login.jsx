import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const goToSignupCandidate = () => {
    navigate('/signup-candidate');
  
  };

  const goToSignupRecruiter = () => {
    navigate('/signup-recruiter');

  };

  return (
    <div>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Se connecter</button>
      </form>

      <button onClick={goToSignupCandidate}>Créer un compte Candidat</button>
      <button onClick={goToSignupRecruiter}>Créer un compte Recruteur</button>
    </div>
  );
}

export default Login;