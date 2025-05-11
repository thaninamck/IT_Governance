import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/sideBar/SideBar';
import HeaderBis from '../components/Header/HeaderBis';
import DashboardWelcome from '../components/DashboardWelcome';

import {useAuth} from '../Context/AuthContext'


function AdminHomePage() {
  
 const { viewMode, changeViewMode, user } = useAuth();
    
      useEffect(() => {
        if (user?.role === 'admin' && viewMode !== 'admin') {
          changeViewMode('admin');
        }
      }, [user, viewMode, changeViewMode]);

  return (
    <div className="flex ">
    {/* Barre latérale fixe */}
    <SideBar user={user} className=" flex-shrink-0 h-full fixed" />

    {/* Contenu principal défilable */}
    <div className=" flex-1 flex flex-col h-screen overflow-y-auto">
      {/* En-tête */}
      <HeaderBis />
      <div className="flex items-center justify-center   h-screen ">
    <DashboardWelcome/>
     </div>
     </div>
  </div>
  )
}

export default AdminHomePage