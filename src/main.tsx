import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { BookingsProvider } from './context/BookingsContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <BookingsProvider>
        <App />
      </BookingsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
