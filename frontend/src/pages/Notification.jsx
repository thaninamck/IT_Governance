import React from 'react';
import SideBar from '../components/sideBar/SideBar';
import HeaderBis from '../components/Header/HeaderBis';
import NotificationBar from '../components/Notification/NotificationBar';
import { useAuth } from '../Context/AuthContext';
import SideBarStdr from '../components/sideBar/SideBarStdr';

function Notification() {
   const { user} = useAuth();
  return (
    <div className="flex ">
      {/* Barre latérale fixe */}
      {user?.role === "admin" ? (
        <SideBar user={user} />
      ) : (
        <SideBarStdr user={user} />
      )}

      {/* Contenu principal défilable */}
      <div className=" flex-1 flex flex-col h-screen overflow-y-auto">
        {/* En-tête */}
        <HeaderBis />

        {/* Barre de notifications */}
        
          <NotificationBar  />
       
      </div>
    </div>
  );
}

export default Notification;
