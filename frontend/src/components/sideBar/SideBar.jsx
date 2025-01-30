import React, { useState } from 'react';
import "./SideBar.css";
import icons from '../../assets/Icons'; // Importation des icônes
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

function SideBar({ userRole }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const menuItems = {
    admin: ["profile", "dashboard", "utilisateurs", "Référentiels", "missions", "clients", "notification", "settings", "platforme"],
    testeur: ["profile", "missions", "notification"],
    manager: ["profile", "missions", "notification", "revue"],
    superviseur: ["profile", "missions", "notification", "revue"]
  };

  const menuDetails = {
    profile: "Profile",
    dashboard: "Dashboard",
    utilisateurs: "Utilisateur",
    Référentiels: "Référentiels",
    missions: "Missions",
    clients: "Clients",
    notification: "Notification",
    revue: "Revue",
    settings: "Settings",
    platforme: "Platforme"
  };

  const userMenu = menuItems[userRole] || [];
  const LogoutIcon = icons["logout"];

  return (
    <div className={`sidebar_container ${isExpanded ? "expanded" : "collapsed"}`}>
    {/* Bouton pour ouvrir/fermer le menu */}
    <div className="toggle_icon" onClick={() => setIsExpanded(!isExpanded)}>
      {isExpanded ? <ArrowBackIosNewRoundedIcon sx={{color:"white" ,width:"25px",height:"25px"}}  /> : <MenuRoundedIcon sx={{color:"white" ,width:"38px",height:"38px"}} />}
    </div>

    {/* Affichage du menu complet si ouvert */}
    {isExpanded && (
      <>
      <div className='user_info'>
        <div>LK</div>
        <h3>Lotfi Koliai</h3>
        <span>Directeur - Consultant IT</span>
      </div>

      {/* Liste des menus dynamiques */}
      <div className='menu_list'>
        <ul className='menu_items'>
          {userMenu.map((item) => {
            const IconComponent = icons[item];
            return (
              <li
                key={item}
                className={`menu_item ${selectedItem === item ? 'active' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                {IconComponent && <IconComponent sx={{ width: "30px", paddingRight: "10px" }} />}
                {menuDetails[item]}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Option "Se Déconnecter" fixe en bas */}
      <div className='logout_section'>
        <ul>
        <li
          className="menu_item logout_item"
          onClick={() => console.log("Déconnexion...")} // À remplacer par la logique de déconnexion
        >
          {LogoutIcon && <LogoutIcon sx={{ width: "30px", paddingRight: "10px" }} />}
          Se déconnecter
        </li>
        </ul>
      </div>
      </>
    )}
    </div>
  );
}

export default SideBar;
