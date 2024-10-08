import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  
  // Token yoksa, kullanıcıyı login sayfasına yönlendir
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token varsa, alt route'ları render et
  return <Outlet />;
};

export default ProtectedRoute;