import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authHeader, handleResponse } from '../Services/fack.backend';

const PrivateRoute = () => {
  const [login, setLogin] = useState(JSON.parse(localStorage.getItem('login')));
  const [authenticated, setAuthenticated] = useState(false);
  const jwt_token = localStorage.getItem('token');

  useEffect(() => {
    const requestOptions = { method: 'GET', headers: authHeader() };
    fetch('/users', requestOptions).then(handleResponse);
    setAuthenticated(JSON.parse(localStorage.getItem('authenticated')));

    localStorage.setItem('authenticated', authenticated);
    localStorage.setItem('login', login);
  }, []);
  return login || authenticated || jwt_token ? <Outlet /> : <Navigate exact to={`/login`} />;
};

export default PrivateRoute;
