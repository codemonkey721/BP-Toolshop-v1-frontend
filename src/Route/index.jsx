import React from 'react';
import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { configureFakeBackend, authHeader, handleResponse } from '../Services/fack.backend';
import Callback from '../Auth/Callback';
import Loader from '../Layout/Loader';
import { authRoutes } from './AuthRoutes';
import LayoutRoutes from '../Route/LayoutRoutes';

import __Login from '../__pages/__auth/__Login';
import __Register from '../__pages/__auth/__Register';
import __ForgetPwd from '../__pages/__auth/__ForgetPwd';

import PrivateRoute from './PrivateRoute';
import { classes } from '../Data/Layouts';

// setup fake backend
configureFakeBackend();
const Routers = () => {
  const login = useState(JSON.parse(localStorage.getItem('login')))[0];
  const [authenticated, setAuthenticated] = useState(false);
  const jwt_token = localStorage.getItem('token');
  const defaultLayoutObj = classes.find((item) => Object.values(item).pop(1) === 'compact-wrapper');
  const layout = localStorage.getItem('layout') || Object.keys(defaultLayoutObj).pop();

  useEffect(() => {
    let abortController = new AbortController();
    const requestOptions = { method: 'GET', headers: authHeader() };
    fetch('/users', requestOptions).then(handleResponse);

    setAuthenticated(JSON.parse(localStorage.getItem('authenticated')));
    console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
    console.disableYellowBox = true;
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <BrowserRouter basename={'/'}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path={'/'} element={<PrivateRoute />}>
            {login || authenticated || jwt_token ? (
              <>
                <Route exact path={`${process.env.PUBLIC_URL}`} element={<Navigate to={`${process.env.PUBLIC_URL}/dashboard/default/${layout}`} />} />
                {/* <Route exact path={`/`} element={<Navigate to={`${process.env.PUBLIC_URL}/dashboard/default/${layout}`} />} /> */}
                <Route exact path={`/`} element={<Navigate to={`/login`} />} />
              </>
            ) : (
              ''
            )}
            <Route path={`/*`} element={<LayoutRoutes />} />
          </Route>
          <Route path={`${process.env.PUBLIC_URL}/callback`} render={() => <Callback />} />
          <Route exact path={`/login`} element={<__Login />} />
          <Route exact path={`/register`} element={<__Register />} />
          <Route exact path={`/forget_password`} element={<__ForgetPwd />} />
          {authRoutes.map(({ path, Component }, i) => (
            <Route path={path} element={Component} key={i} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routers;
