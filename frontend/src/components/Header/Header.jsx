import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Header.css";
import icons from '../../assets/Icons'; // Importer l'objet contenant les icônes
import NotificationPopup from '../Notification/NotificationPopup';
import { useAuth } from '../../Context/AuthContext';
import useNotification from '../../Hooks/useNotification';
import grcenterlogo1 from '../../../public/grcenterlogo1.png'

function Header({user}) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
 // const [unreadCount, setUnreadCount] = useState(3); // Example: Initial unread notifications count
const { logout } = useAuth();
const { unreadCount } = useNotification();
const notificationRef = useRef(null);
// const handleLogout = () => {
//   logout();
//   navigate("/login");
// };
const handleLogout = async () => {
  try {
      await logout(); // Appeler la fonction de déconnexion du contexte
      navigate('/login'); // Rediriger vers la page de connexion
  } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
  }
};

 // Fermer le popup si on clique en dehors
 useEffect(() => {
  const handleClickOutside = (event) => {
    // Vérifier si le clic est à l'extérieur du conteneur
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);
  return (
    <div className='header_container'>
      {/* Logo */}
      <div className='header_logo' onClick={() => navigate('/')}>
        <img src={grcenterlogo1} alt='Mazars Logo' />
      </div>

      {/* Icons et utilisateur */}
      <div className="header_icons">
        {/* Home - Retour à l'index */}
        <icons.home 
          className="icon_home" 
          sx={{ color: 'var(--blue-icons)', cursor: 'pointer' }} 
          onClick={() => navigate('/missions')} 
        />

        {/* Notifications - Affichage du popup */}
        <div className="notification_wrapper"  ref={notificationRef}>
          <div className="notification_icon_container">
            {/* <icons.notifications 
              className="icon_notifications" 
              sx={{ color: 'var(--blue-icons)', cursor: 'pointer' }} 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadCount(0); // Reset unread count when popup is opened
              }} 
            /> */}
            <icons.notifications 
  className={`icon_notifications ${unreadCount > 0 ? 'animate-pulse' : ''}`} 
  sx={{ color: 'var(--blue-icons)', cursor: 'pointer' }} 
  onClick={() => {
    setShowNotifications(!showNotifications);
   // setUnreadCount(0); // reset une fois ouvert
  }} 
/>
            {unreadCount > 0 && (
  <span className="notification_marker animate-push-up">
    {unreadCount}
  </span>
)}

            {/* Display unread notification count 
            {unreadCount > 0 && <span className="notification_marker">{unreadCount}</span>}*/}
          </div>

          {showNotifications && (
            <NotificationPopup
           //  setUnreadCount={setUnreadCount} 
             />
          )}
        </div>

        {/* Profil utilisateur */}
        <div className="user_initials" onClick={() => navigate('/profile')}>  {user?.fullName?.split(' ').map(n => n[0]).join('')}</div>
        <span className="user_name" onClick={() => navigate('/profile')}>{user?.fullName || 'Utilisateur'}</span>

        {/* Logout - Retour à la page de connexion */}
        <icons.logout 
          className="icon_logout" 
          sx={{ color: 'var(--blue-icons)', cursor: 'pointer' }} 
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}

export default Header;
