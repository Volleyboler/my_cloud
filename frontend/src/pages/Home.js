import React from 'react';
import Header from '../components/Layout/Header';

const Home = () => {
  return (
    <div>
      <Header />
      <main>
        <h2>Добро пожаловать в File Storage</h2>
        <p>Здесь вы можете регистрироваться, входить и управлять своими файлами.</p>
      </main>
    </div>
  );
};

export default Home;