import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';

import Services from './components/Services';
import BecomeWorker from './components/BecomeWorker';
import WorkerProfile from './components/WorkerProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<Services />} />
        <Route path="/become-worker" element={<BecomeWorker />} />
        <Route path="/worker-profile" element={<WorkerProfile />} />
        {/* Placeholder for future routes */}
        <Route path="/services" element={<Navigate to="/home" replace />} />
        <Route path="/contact" element={<Navigate to="/home" replace />} />
        <Route path="/about" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
