// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Splash from '../pages/Splash/Splash';
import Onboarding from '../pages/Onboarding/Onboarding';
import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Agenda from '../pages/Agenda/Agenda';



const AppRoutes = () => {
  return (
    <Routes>
      {/* Sabse pehla route Splash */}
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/agenda" element={<Agenda />} />
      
      {/* 404 Page (Agar koi galat URL daale) */}
      <Route path="*" element={<div><h2>404 - Not Found</h2></div>} />
    </Routes>
  );
};

export default AppRoutes;