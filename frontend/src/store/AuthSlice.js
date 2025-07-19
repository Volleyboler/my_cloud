import { createSlice } from '@reduxjs/toolkit';
import api from '../services/api';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: true, // Добавляем начальное состояние загрузки
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
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logoutSuccess, setLoading } = authSlice.actions;

// Добавляем thunk для проверки аутентификации
export const checkAuth = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get('/api/accounts/status/');
    if (response.data.isAuthenticated) {
      dispatch(loginSuccess({ user: response.data.user }));
    }
  } catch (error) {
    dispatch(logoutSuccess());
  } finally {
    dispatch(setLoading(false));
  }
};

export default authSlice.reducer;