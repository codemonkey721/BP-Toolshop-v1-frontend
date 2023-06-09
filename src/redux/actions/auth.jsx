import api from '../../utils/api';
import { toast } from 'react-toastify';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  AUTH_LOADING
} from './types';

const autoClose = 3000;

/*
  NOTE: we don't need a config object for axios as the
 default headers in axios are already Content-Type: application/json
 also axios stringifies and parses JSON for you, so no need for 
 JSON.stringify or JSON.parse
*/

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get('/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = (formData, role) => async (dispatch) => {
  try {
    const res = await api.post(`/auth/register/${role}`, formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    toast.success("Registered Successfully! Please Login.", {autoClose})
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => {
        toast.error(error.msg, {autoClose})
      });
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const body = { email, password };

  try {
    dispatch(authLoading());
    const res = await api.post('auth/login', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        toast.error(error.msg, {autoClose})
      });
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    const response = await api.post('users/forgotPassword', { email });
    toast.success(response.data.message);
    console.log(response.data);
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error.response.data);
  }
}

// Logout
export const logout = () => ({ type: LOGOUT });

const authLoading = () => dispatch => {
  dispatch({
    type: AUTH_LOADING
  })
}
