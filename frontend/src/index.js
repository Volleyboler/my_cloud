import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'; // Добавьте импорт BrowserRouter
import store from './store/index';
import App from './App';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Router> {/* Оборачиваем App в BrowserRouter */}
      <App />
    </Router>
  </Provider>
);