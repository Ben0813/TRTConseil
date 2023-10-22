import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/views/Login';
import SignupCandidate from './components/views/SignupCandidate';
import SignupRecruiter from './components/views/SignupRecruiter';
import ProfileCandidate from './components/views/ProfileCandidate';


function App() {
  return (
    <div className='flex-grow'>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup-candidate" element={<SignupCandidate />} />
        <Route path="/signup-recruiter" element={<SignupRecruiter />} />
        <Route path="/profile-candidate" element={<ProfileCandidate />} />
      </Routes>
    </div>
  );
}

export default App;
