import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { PermissionRoleProvider } from './Context/permissionRoleContext.jsx';

createRoot(document.getElementById('root')).render(
  
     <Router>
      <PermissionRoleProvider>
    <App />
    </PermissionRoleProvider>
  </Router>
  
)
