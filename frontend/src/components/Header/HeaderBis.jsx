import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Header.css";
import icons from '../../assets/Icons'; // Importer l'objet contenant les icônes

function HeaderBis() {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(3); // Exemple : 3 notifications non lues
  
    return (
      <div className='headerbis_container '>
        
  
        {/* Icons et utilisateur */}
        <div className="headerbis_icons">
          
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
  
         {/* Logout - Retour à la page de connexion */}
<button className="logout_button" onClick={() => navigate('/login')}>
  Se déconnecter
</button>

        </div>
      </div>
  )
}

export default HeaderBis