import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Header.css";
import icons from '../../assets/Icons'; // Importer l'objet contenant les icônes
import NotificationPopup from '../Notification/NotificationPopup';
import { useAuth } from '../../Context/AuthContext'; // Importer le contexte

function HeaderBis() {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(3); // Exemple : 3 notifications non lues

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

    return (
      <div className='headerbis_container'>
        {/* Icons et utilisateur */}
        <div className="headerbis_icons">
          {/* Notifications - Affichage du popup */}
          <div className="notification_wrapper">
            <div className="notification_icon_container">
              <icons.notifications
                className="icon_notifications"
                sx={{ color: 'var(--blue-icons)', cursor: 'pointer', marginRight: "10px" }}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setUnreadCount(0); // Réinitialiser les notifications non lues quand le popup est ouvert
                }}
              />
            </div>

            {showNotifications && (
              <NotificationPopup setUnreadCount={setUnreadCount} />
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