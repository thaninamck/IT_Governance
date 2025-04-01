import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SideBar.css";
import icons from "../../assets/Icons";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

function SideBar({ userRole }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const menuItems = {
        admin: [
          { key: "profile", label: "Profile", path: "/myprofile" },
          { key: "dashboard", label: "Dashboard", path: "/adminHomePage" },
          { key: "utilisateurs", label: "Utilisateurs", path: "/utilisateurs" },
          { key: "Référentiels", label: "Référentiels", path: "/controlsManager" },
          { key: "missions", label: "Missions", path: "/missions" },
          { key: "clients", label: "Clients", path: "/clients" },
          { key: "notification", label: "Notification", path: "/notification" },
          { key: "settings", label: "Settings", path: "/settings" },
          { key: "platforme", label: "Platforme", path: "/platforme" },
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
      };
    
      const userMenu = menuItems[userRole] || [];
      const LogoutIcon = icons["logout"];
    
      const handleNavigation = (path) => {
        setSelectedItem(path); // Marquer l'élément sélectionné
        navigate(path); // Naviguer vers la page correspondante
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
            <div className="avatar">LK</div>
            <h3>Lotfi Koliai</h3>
            <span>Directeur - Consultant IT</span>
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
                    onClick={() => handleNavigation(item.path)}
                  >
                    {IconComponent && <IconComponent className="menu-icon" />}
                    <span>{item.label}</span>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="logout">
            <button className="logout-btn">
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