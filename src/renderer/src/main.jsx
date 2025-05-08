import './assets/main.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../../app/globals.css';
import { Toaster } from './components/ui/toaster';
import { MainRouter } from './router';
import { AuthProvider } from './Context/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <MainRouter />
      <Toaster />
    </AuthProvider>
  </React.StrictMode>
);
