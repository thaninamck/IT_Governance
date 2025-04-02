import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SideBar.css";
import icons from "../../assets/Icons";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";


function SideBarStdr() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();
  
    const menuItems = [
          { key: "profile", label: "Profile", path: "/myprofile" },
          { key: "missions", label: "Mes missions", path: "/missions" },
          { key: "settings", label: "Paramètres", path: "/settings" }
        ]
      
      // Récupération du menu avec fallback sur 'default' si le rôle n'existe pas
      const userMenu = menuItems;

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
  

export default SideBarStdr