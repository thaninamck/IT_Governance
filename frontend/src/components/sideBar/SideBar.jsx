import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SideBar.css";
import icons from "../../assets/Icons";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useAuth } from "../../Context/AuthContext";

function SideBar({ user }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const { logout ,viewMode, changeViewMode } = useAuth();

  const menuItems = {
    admin: [
      { key: "profile", label: "Profile", path: "/myprofile" },
      { key: "dashboard", label: "Dashboard", path: "/dashboard" },
      { key: "utilisateurs", label: "Utilisateurs", path: "/utilisateurs" },
      { key: "Référentiels", label: "Référentiels", path: "/controlsManager" },
      { key: "missions", label: "Missions", path: "/missions" },
      { key: "clients", label: "Clients", path: "/clients" },
      { key: "notification", label: "Notification", path: "/notification" },
      { key: "settings", label: "Settings", path: "/settings" },
      { key: "platforme", label: "Platforme", path: "/missionsUserViewMode" },
    ],
    testeur: [
      { key: "profile", label: "Profile", path: "/myprofile" },
      { key: "missions", label: "Missions", path: "/missions" },
      { key: "notification", label: "Notification", path: "/notification" },
    ],
    manager: [
      { key: "profile", label: "Profile", path: "/myprofile" },
      { key: "missions", label: "Missions", path: "/missions" },
      { key: "notification", label: "Notification", path: "/notification" },
      { key: "revue", label: "Revue", path: "/revue" },
    ],
    superviseur: [
      { key: "profile", label: "Profile", path: "/myprofile" },
      { key: "missions", label: "Missions", path: "/missions" },
      { key: "notification", label: "Notification", path: "/notification" },
      { key: "revue", label: "Revue", path: "/revue" },
    ],
    // Menu par défaut pour les autres rôles
    default: [
      { key: "profile", label: "Profile", path: "/myprofile" },
      { key: "missions", label: "Mes missions", path: "/missions" },
      { key: "settings", label: "Paramètres", path: "/settings" }
    ]
  };
  
  // Récupération du menu avec fallback sur 'default' si le rôle n'existe pas
  const userMenu = menuItems[user?.role] || menuItems.default;
      const LogoutIcon = icons["logout"];
    
      const handleNavigation = (path, key) => {
        if (user?.role === "admin" && key === "platforme") {
          changeViewMode("user");
        }
        setSelectedItem(path); // Marquer l'élément sélectionné
        navigate(path); // Naviguer vers la page correspondante
      };
      const handleLogout = () => {
        logout();
        navigate("/login");
      };
  return (
    <div className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      <div className="toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? (
          <ArrowBackIosNewRoundedIcon className="icon" />
        ) : (
          <MenuRoundedIcon className="icon" />
        )}
      </div>

      {isExpanded && (
        <div className="sidebar-content">
          <div className="user-info">
            <div className="avatar">
            {user?.fullName?.split(' ').map(n => n[0]).join('')}
            </div>
            <h3>{user?.fullName || 'Utilisateur'}</h3>
            <span>{user?.position || 'Poste non défini'}</span>
          </div>

          <nav className="menu">
            <ul>
              {userMenu.map((item) => {
                const IconComponent = icons[item.key];
                return (
                  <li
                    key={item.key}
                    className={`menu-item ${
                      selectedItem === item.path ? "active" : ""
                    }`}
                    //onClick={() => handleNavigation(item.path)}
                    onClick={() => handleNavigation(item.path, item.key)}
                  >
                    {IconComponent && <IconComponent className="menu-icon" />}
                    <span>{item.label}</span>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="logout">
            <button className="logout-btn" onClick={handleLogout}>
              {LogoutIcon && <LogoutIcon className="logout-icon" />}
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SideBar;