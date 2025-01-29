import React, { useState } from "react";
import PasswordChange from "../Forms/PasswordChange";

function HeaderSettings () {
  // État pour gérer l'onglet actif
  const [activeTab, setActiveTab] = useState("profile");

  // Contenu des onglets
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <PasswordChange title="Changer mon mot de passe" />;
      case "password":
        return <div>Contenu de la page Mot de Passe</div>;
      case "logs":
        return <div>Contenu de la page Logs</div>;
      case "settings":
        return <div>Contenu de la page Paramétrage</div>;
      default:
        return <div>Page non trouvée</div>;
    }
  };

  return (
    <div className="p-4">
      {/* Barre de navigation */}
      <div className="flex  border-b pb-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2  ${
            activeTab === "profile" ? "border-none  " :" rounded-none rounded-l-lg   text-[var(--subfont-gray)] border-none bg-[#F9F9F9]"

          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 ${
            activeTab === "password" ? "border-none " : " rounded-none text-[var(--subfont-gray)] border-none bg-[#F9F9F9]"
          }`}
        >
          Mot de passe
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 ${
            activeTab === "logs" ? "border-none " : " rounded-none text-[var(--subfont-gray)] border-none bg-[#F9F9F9]"
          }`}
        >
          Logs
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 ${
            activeTab === "settings" ? "border-none " : "  rounded-none rounded-r-lg text-[var(--subfont-gray)] border-none bg-[#F9F9F9]"
          }`}
        >
          Paramétrage
        </button>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default HeaderSettings;
