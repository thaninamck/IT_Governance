import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SideBar.css";
import icons from "../../assets/Icons";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useAuth } from "../../Context/AuthContext";


function SideBarStdr({ user }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, changeViewMode, viewMode } = useAuth();



  const menuItems = user?.role === 'admin' ? [
    { key: "profile", label: "Profile", path: "/myprofile" },
    { key: "missions", label: "Mes missions", path: "/missionsUserViewMode" },
    { key: "notification", label: "Notification", path: "/notification" },
    { key: "Return", label: "Retour", path: "/missions" },
  ] : [
    { key: "profile", label: "Profile", path: "/myprofile" },
    { key: "missions", label: "Mes missions", path: "/missions" },
    { key: "notification", label: "Notification", path: "/notification" },
    // { key: "Revue", label: "Revue", path: "/revue" },
  ];


  // Récupération du menu avec fallback sur 'default' si le rôle n'existe pas
  const userMenu = menuItems;

  const LogoutIcon = icons["logout"];

  // Gestion du retour navigateur
 // Synchronisation avec la route actuelleuseEffect(() => {
  // Seulement pour les admins
  useEffect(() => {
  if (user?.role !== 'admin') return;

  // Détection plus précise du mode "user"
  if (location.pathname.startsWith('/missionsUserViewMode')) {
    if (viewMode !== 'user') {
      console.log('Changing to user mode');
      changeViewMode('user');
    }
    return;
  }

  // Détection des routes admin
  const adminRoutes = [
    '/missions',
    '/clients',
    '/settings',
    '/adminHomePage',
    '/controlsManager',
    '/utilisateurs'
  ];

  if (adminRoutes.some(route => location.pathname.startsWith(route))) {
    if (viewMode !== 'admin') {
      console.log('Changing to admin mode');
      changeViewMode('admin');
    }
  }
}, [location.pathname, user?.role, viewMode]); // Note: changeViewMode ne doit pas changer

const handleNavigation = (path, key) => {
  if (user?.role === "admin" && key === "Return") {
    changeViewMode("admin");
    navigate(path);
    return;
  }
  setSelectedItem(path);
  navigate(path);
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
            <h3 className="my-2 text-xl">{user?.fullName || 'Utilisateur'}</h3>
            <span className=" text-sm font-regular text-white">{user?.position.name || 'Poste non défini'}</span>
          </div>

          <nav className="menu">
            <ul>
              {userMenu.map((item) => {
                const IconComponent = icons[item.key];
                return (
                  <li
                    key={item.key}
                    className={`menu-item ${selectedItem === item.path ? "active" : ""
                      }`}
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


export default SideBarStdr