import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/views/Login';
import SignupCandidate from './components/views/SignupCandidate';
import SignupRecruiter from './components/views/SignupRecruiter';
import SignupAdministrator from './components/views/SignupAdministrator';
import ProfileCandidate from './components/views/ProfileCandidate';
import ProfileRecruiter from './components/views/ProfileRecruiter';
import ProfileAdministrator from './components/views/ProfileAdministrator';


function App() {
  return (
    <div className='flex-grow'>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup-candidate" element={<SignupCandidate />} />
        <Route path="/signup-recruiter" element={<SignupRecruiter />} />
        <Route path="/signup-administrator" element={<SignupAdministrator />} />
        <Route path="/profile-candidate" element={<ProfileCandidate />} />
        <Route path="/profile-recruiter" element={<ProfileRecruiter />} />
        <Route path="/profile-administrator" element={<ProfileAdministrator />} />
      </Routes>
    </div>
  );
}

export default App;
