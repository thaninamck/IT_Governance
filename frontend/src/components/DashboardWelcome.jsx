import React from "react";
import { useNavigate } from "react-router-dom";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";

const DashboardWelcome = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 1,
      label: "Ajouter d’autre utilisateur",
      icon: <GroupAddRoundedIcon sx={{ color: "var(--blue-menu)", width: "30px", height: "30px" }} />,
      route: "/utilisateurs",
    },
    {
      id: 2,
      label: "Les Statistiques",
      icon: <BarChartRoundedIcon sx={{ color: "var(--blue-menu)", width: "30px", height: "30px" }} />,
      route: "/statistiques",
    },
    {
      id: 3,
      label: "Plateforme",
      icon: <LanguageRoundedIcon sx={{ color: "var(--blue-menu)", width: "30px", height: "30px" }} />,
      route: "/plateforme",
    },
  ];

  return (
    <div className="h-screen flex items-start justify-start ">
      <div className=" p-8 rounded-lg  text-font-gray w-[400px] m-10">
        <p className="text-2xl font-semibold mb-6">Bienvenue sur votre tableau de bord</p>

        <ul className="space-y-6">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => navigate(item.route)}
              className="flex items-center space-x-4 cursor-pointer hover:text-blue-400"
            >
              <div className="bg-blue-100 p-2 rounded">{item.icon}</div>
              <span className="text-lg">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardWelcome;
