import { createSlice } from '@reduxjs/toolkit';
import api from '../services/api';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.loading = false;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    }
  }
});

export const logout = () => async (dispatch) => {
  try {
    await api.post('/api/accounts/logout/');
    dispatch(logoutUser());
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export const { loginStart, loginSuccess, loginFailure, logoutUser } = authSlice.actions;
export default authSlice.reducer;