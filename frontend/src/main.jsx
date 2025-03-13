import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { PermissionRoleProvider } from './Context/permissionRoleContext.jsx';
import { AuthProvider } from './Context/AuthContext'; 

createRoot(document.getElementById('root')).render(
  <Router>
    <AuthProvider> 
      <PermissionRoleProvider>
        <App />
      </PermissionRoleProvider>
    </AuthProvider>
  </Router>
);
