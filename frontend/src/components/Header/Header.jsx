import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Header.css";
import icons from '../../assets/Icons'; // Importer l'objet contenant les icônes

function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // Exemple : 3 notifications non lues

  return (
    <div className='header_container'>
      {/* Logo */}
      <div className='header_logo' onClick={() => navigate('/')}>
        <img src='./mazars_logo.png' alt='Mazars Logo' />
      </div>

      {/* Icons et utilisateur */}
      <div className="header_icons">
        {/* Home - Retour à l'index */}
        <icons.home 
          className="icon_home" 
          sx={{ color: 'var(--blue-icons)', cursor: 'pointer' }} 
          onClick={() => navigate('/')} 
        />

        {/* Notifications - Affichage du popup */}
        <div className="notification_wrapper">
          <div className="notification_icon_container">
            <icons.notifications 
              className="icon_notifications" 
              sx={{ color: 'var(--blue-icons)', cursor: 'pointer' }} 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadCount(0); // Réinitialiser les notifications non lues quand le popup est ouvert
              }} 
            />
            {/* Marqueur des notifications non lues */}
            {unreadCount > 0 && <span className="notification_marker">{unreadCount}</span>}
          </div>

          {showNotifications && (
            <div className="notifications_popup">
              <p>🔔 Nouvelle notification 1</p>
              <p>🔔 Nouvelle notification 2</p>
              <p>🔔 Nouvelle notification 3</p>
            </div>
          )}
        </div>

        {/* Profil utilisateur */}
        <div className="user_initials" onClick={() => navigate('/profile')}>TM</div>
        <span className="user_name" onClick={() => navigate('/profile')}>Thanina Mecherak</span>

        {/* Logout - Retour à la page de connexion */}
        <icons.logout 
          className="icon_logout" 
          sx={{ color: 'var(--blue-icons)', cursor: 'pointer' }} 
          onClick={() => navigate('/login')} 
        />
      </div>
    </div>
  );
}

export default Header;
