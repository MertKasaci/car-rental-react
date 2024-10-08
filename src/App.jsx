import React from 'react';
import { BrowserRouter as Router, Route,Routes,Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfile';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import ReservationPage from './pages/ReservationPage';
import MyReservationsPage from './pages/MyReservationsPage';
import ContactPage from './pages/ContactPage';

import ProtectedRoute from './components/ProtectedRoute';




const App = () => {
  return (
    
    <Router>
    <Routes>   
      <Route path="/login" element={<LoginPage />} />  
      <Route path="/register" element={<SignupPage />} />
      <Route path="/profile" element={<UserProfile/>} />
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
      <Route path="/reservations/create/:id" element={<ReservationPage/>} />
      <Route path="/my-reservations" element={<MyReservationsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route element={<ProtectedRoute/>}>
      <Route path="/" element={<HomePage/>} />
      </Route> 

      {/* Eşleşmeyen route'ları ana sayfaya yönlendir */}
      <Route path="*" element={<Navigate to="/" replace />} />
     
    </Routes>
  </Router>
  );
}

export default App;

