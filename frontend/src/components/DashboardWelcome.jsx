import React from 'react';
import { User, BarChart, LayoutDashboard } from 'lucide-react'; // Icons from lucide-react
import { useNavigate } from 'react-router-dom'; // React Router
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';

const DashboardWelcome = () => {
  const navigate = useNavigate(); // Hook pour gérer la navigation

  // Tableau des éléments de la liste
  const menuItems = [
    {
      id: 1,
      label: "Ajouter d’autre utilisateur",
      icon: <GroupAddRoundedIcon sx={{color:"var(--blue-menu)",width:"30px" ,height:"30px"}}/>,
      route: "/utilisateurs",
    },
    {
      id: 2,
      label: "Les Statistiques",
      icon: <BarChartRoundedIcon sx={{color:"var(--blue-menu)",width:"30px" ,height:"30px"}} />,
      route: "/statistiques",
    },
    {
      id: 3,
      label: "Plateforme",
      icon: <LanguageRoundedIcon  sx={{color:"var(--blue-menu)",width:"30px" ,height:"30px"}} />,
      route: "/plateforme",
    },
  ];

  return (
    <div className="flex flex-col   space-y-8  ">
      <p className="text-5xl font-semibold text-gray-800" style={{ color: 'var(--font-gray)' }}>
  Bienvenue sur votre tableau de bord
</p>

      <ul className="flex flex-col items-start ">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => navigate(item.route)} // Redirection vers la route spécifiée
            className="  flex  items-center space-x-7 m-3 mt-9 cursor-pointer hover:text-blue-600"
          >
            <div className="bg-blue-100 p-3 rounded">{item.icon}</div>
            <span className="text-2xl font-medium text-gray-700">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardWelcome;
