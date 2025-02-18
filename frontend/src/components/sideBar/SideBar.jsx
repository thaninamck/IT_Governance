import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SideBar.css";
import icons from "../../assets/Icons"; // Importation des icônes
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

function SideBar({ userRole }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate(); // Hook pour naviguer dynamiquement

  const menuItems = {
    admin: [
      { key: "profile", label: "Profile", path: "/myprofile" },
      { key: "dashboard", label: "Dashboard", path: "/adminHomePage" },
      { key: "utilisateurs", label: "Utilisateurs", path: "/utilisateurs" },
      { key: "Référentiels", label: "Référentiels", path: "/controlsManager" },
      { key: "missions", label: "Missions", path: "/gestionmission" },
      { key: "clients", label: "Clients", path: "/clients" },
      { key: "notification", label: "Notification", path: "/notification" },
      { key: "settings", label: "Settings", path: "/settings" },
      { key: "platforme", label: "Platforme", path: "/platforme" },
    ],
    testeur: [
      { key: "profile", label: "Profile", path: "/profile" },
      { key: "missions", label: "Missions", path: "/missions" },
      { key: "notification", label: "Notification", path: "/notification" },
    ],
    manager: [
      { key: "profile", label: "Profile", path: "/profile" },
      { key: "missions", label: "Missions", path: "/missions" },
      { key: "notification", label: "Notification", path: "/notification" },
      { key: "revue", label: "Revue", path: "/revue" },
    ],
    superviseur: [
      { key: "profile", label: "Profile", path: "/profile" },
      { key: "missions", label: "Missions", path: "/missions" },
      { key: "notification", label: "Notification", path: "/notification" },
      { key: "revue", label: "Revue", path: "/revue" },
    ],
  };

  const userMenu = menuItems[userRole] || [];
  const LogoutIcon = icons["logout"];

  const handleNavigation = (path) => {
    setSelectedItem(path); // Marquer l'élément sélectionné
    navigate(path); // Naviguer vers la page correspondante
  };

  return (
    <div className={`sidebar_container ${isExpanded ? "expanded" : "collapsed"}`}>
      {/* Bouton pour ouvrir/fermer le menu */}
      <div className="toggle_icon" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? (
          <ArrowBackIosNewRoundedIcon sx={{ color: "white", width: "25px", height: "25px" }} />
        ) : (
          <MenuRoundedIcon sx={{ color: "white", width: "38px", height: "38px" }} />
        )}
      </div>

      {/* Affichage du menu complet si ouvert */}
      {isExpanded && (
        <>
          <div className="user_info">
            <div>LK</div>
            <h3>Lotfi Koliai</h3>
            <span>Directeur - Consultant IT</span>
          </div>

          {/* Liste des menus dynamiques */}
          <div className="menu_list">
            <ul className="menu_items">
              {userMenu.map((item) => {
                const IconComponent = icons[item.key];
                return (
                  <li
                    key={item.key}
                    className={`menu_item ${selectedItem === item.path ? "active" : ""}`}
                    onClick={() => handleNavigation(item.path)} // Appel de la navigation
                  >
                    {IconComponent && <IconComponent sx={{ width: "30px", paddingRight: "10px" }} />}
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Option "Se Déconnecter" fixe en bas */}
          <div className="logout_section">
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
