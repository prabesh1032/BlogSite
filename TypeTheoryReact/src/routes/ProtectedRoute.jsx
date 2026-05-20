import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useStateContext from '../context/useStateContext';


const ProtectedRoute = () => {
  const { token } = useStateContext();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;