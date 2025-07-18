import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from './store/AuthSlice';
import axios from './services/api';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import Storage from './pages/Storage';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import ErrorHandler from './components/Shared/ErrorHandler';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          switch (error.response.status) {
            case 401:

              dispatch(logoutSuccess());
              navigate('/login');
              break;
            case 403:

              navigate('/error', { state: { error: error.response } });
              break;
            case 404:

              navigate('/error', { state: { error: error.response } });
              break;
            default:

              console.error('API Error:', error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [dispatch, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminPanel />
        </ProtectedRoute>
      } />
      
      <Route path="/storage" element={
        <ProtectedRoute>
          <Storage />
        </ProtectedRoute>
      } />
      
      <Route path="/error" element={<ErrorHandler />} />
      <Route path="*" element={<ErrorHandler />} />
    </Routes>
  );
}

export default App;