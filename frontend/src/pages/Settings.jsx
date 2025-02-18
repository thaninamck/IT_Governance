import React, { useState } from "react";
import HeaderSettings from "../components/Header/HeaderSettings";
import HeaderBis from "../components/Header/HeaderBis";
import SideBar from "../components/sideBar/SideBar";
import HeaderWithAction from "../components/Header/HeaderWithAction";
import Logs from "./subPages/logs";
import Parametrage from "./subPages/Parametrage";
import PasswordPolicyConfig from "./subPages/PasswordPolicyConfig";
import MyProfile from "./MyProfile";

function Settings() {
  // État pour gérer l'onglet actif
  const [activeTab, setActiveTab] = useState("logs");

  // Contenu des onglets
  const renderTabContent = () => {
    switch (activeTab) {
    
      case "password":
        return <PasswordPolicyConfig/>;
      case "logs":
        return <Logs/>;
      case "settings":
        return <div className=" "><Parametrage/></div>;
      default:
        return <div>Page non trouvée</div>;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar pour la navigation */}
      <SideBar userRole="admin" className="flex-shrink-0 h-full fixed" />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <HeaderBis />
        <HeaderWithAction title="Settings" buttonLabel="" />
        <HeaderSettings activeTab={activeTab} setActiveTab={setActiveTab} renderTabContent={renderTabContent} />
      </div>
    </div>
  );
}

export default Settings;