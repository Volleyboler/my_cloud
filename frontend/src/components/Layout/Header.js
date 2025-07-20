import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../store/AuthSlice';
import api from '../../services/api';

const Header = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/api/accounts/logout/');
      dispatch(logoutUser());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <h1>Dunkan Mycloud</h1>
      <nav>
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="nav-link">Вход</Link>
            <Link to="/register" className="nav-link">Регистрация</Link>
          </>
        ) : (
          <>
            <Link to="/storage" className="nav-link">Хранилище</Link>
            {user?.is_admin && (
              <Link to="/admin" className="nav-link">Админка</Link>
            )}
            <button onClick={handleLogout} className="logout-btn">
              Выход
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;