import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <h1>Dunkan Mycloud</h1>
      <nav>
        {!isAuthenticated ? (
          <>
            <Link to="/login">Вход</Link>
            <Link to="/register">Регистрация</Link>
          </>
        ) : (
          <>
            <Link to="/storage">Хранилище</Link>
            {user && user.is_admin && (
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