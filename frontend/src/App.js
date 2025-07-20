import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, logoutUser } from './store/AuthSlice';
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
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          const errorData = {
            status: error.response.status,
            data: error.response.data
          };

          switch (error.response.status) {
            case 401:
              dispatch(logoutUser());
              navigate('/login');
              break;
            case 403:
              navigate('/error', { state: { error: errorData } });
              break;
            case 404:
              navigate('/error', { state: { error: errorData } });
              break;
            default:
              console.error('API Error:', error);
              navigate('/error', { state: { error: errorData } });
          }
        } else {
          console.error('Network Error:', error);
          navigate('/error', { 
            state: { 
              error: {
                status: 500,
                data: { message: 'Ошибка сети. Проверьте подключение.' }
              }
            } 
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Проверка аутентификации...</p>
      </div>
    );
  }

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
      
      <Route 
        path="/error" 
        element={<ErrorHandler error={window.history.state?.usr?.error} />} 
      />
      <Route 
        path="*" 
        element={<ErrorHandler error={{ status: 404, data: { message: 'Страница не найдена' } }} />} 
      />
    </Routes>
  );
}

export default App;