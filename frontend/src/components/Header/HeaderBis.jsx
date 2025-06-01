import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Header.css";
import icons from '../../assets/Icons'; // Importer l'objet contenant les icônes
import NotificationPopup from '../Notification/NotificationPopup';
import { useAuth } from '../../Context/AuthContext'; // Importer le contexte
import useNotification from '../../Hooks/useNotification';

function HeaderBis() {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    //const [unreadCount, setUnreadCount] = useState(); // Exemple : 3 notifications non lues
    const { unreadCount } = useNotification();
    const notificationRef = useRef(null);
    // Utiliser le contexte d'authentification
    const { logout } = useAuth();

    // Fonction pour se déconnecter
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
      <div className='headerbis_container'>
        {/* Icons et utilisateur */}
        <div className="headerbis_icons">
          {/* Notifications - Affichage du popup */}
          <div className="notification_wrapper"  ref={notificationRef}>
            <div className="notification_icon_container">
            <icons.notifications 
  className={`icon_notifications ${unreadCount > 0 ? 'animate-pulse' : ''}`} 
  sx={{ color: 'var(--blue-icons)', cursor: 'pointer' }} 
  onClick={() => {
    setShowNotifications(!showNotifications);
  //  setUnreadCount(0); // reset une fois ouvert
  }} 
/>
            {unreadCount > 0 && (
  <span className="notification_marker animate-push-up">
    {unreadCount}
  </span>
)}
            </div>

            {showNotifications && (
              <NotificationPopup 
             // setUnreadCount={setUnreadCount} 
              />
            )}
          </div>

          {/* Logout - Retour à la page de connexion */}
          <button className="logout_button" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </div>
    );
}

export default HeaderBis;