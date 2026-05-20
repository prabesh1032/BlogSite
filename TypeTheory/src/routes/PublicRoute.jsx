import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useStateContext from '../context/useStateContext';

const PublicRoute = () => {
  const { token } = useStateContext();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;