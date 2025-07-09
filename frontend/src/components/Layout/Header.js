import { useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <h1>File Storage</h1>
      <nav>
        {!isAuthenticated ? (
          <>
            <Link to="/login">Вход</Link>
            <Link to="/register">Регистрация</Link>
          </>
        ) : (
          <>
            <Link to="/storage">Хранилище</Link>
            {isAuthenticated && isAuthenticated.user.is_admin && (
              <Link to="/admin">Админка</Link>
            )}
            <button onClick={handleLogout}>Выход</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;