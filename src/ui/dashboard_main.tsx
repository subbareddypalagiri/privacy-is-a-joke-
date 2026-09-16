import React from 'react';
import ReactDOM from 'react-dom/client';
import { Dashboard } from './Dashboard';
import './index.css';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Dashboard />
    </React.StrictMode>
  );
}
