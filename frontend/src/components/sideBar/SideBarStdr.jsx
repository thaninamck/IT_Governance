import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SideBar.css";
import icons from "../../assets/Icons";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useAuth } from "../../Context/AuthContext";


function SideBarStdr({user}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();
     const { logout } = useAuth();
  
    const menuItems = [
          { key: "profile", label: "Profile", path: "/myprofile" },
          { key: "missions", label: "Mes missions", path: "/missions" },
          { key: "notification", label: "Notification", path: "/notification" },
      
        ]
      
      // Récupération du menu avec fallback sur 'default' si le rôle n'existe pas
      const userMenu = menuItems;

        const LogoutIcon = icons["logout"];
      
        const handleNavigation = (path) => {
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
  

export default SideBarStdr