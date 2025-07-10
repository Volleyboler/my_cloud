import React from 'react';
import Header from '../components/Layout/Header';

const Home = () => {
  return (
    <div>
      <Header />
      <main>
        <h2>Добро пожаловать в Dunkan Mycloud</h2>
        <p>Здесь вы можете загружать, хранить и делиться своими файлами.</p>
      </main>
    </div>
  );
};

export default Home;