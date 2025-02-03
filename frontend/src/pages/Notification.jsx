import React from 'react';
import SideBar from '../components/sideBar/SideBar';
import HeaderBis from '../components/Header/HeaderBis';
import NotificationBar from '../components/Notification/NotificationBar';

function Notification() {
  return (
    <div className="flex ">
      {/* Barre latérale fixe */}
      <SideBar userRole="manager" className=" flex-shrink-0 h-full fixed" />

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
