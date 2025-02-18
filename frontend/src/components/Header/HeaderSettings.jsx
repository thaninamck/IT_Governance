import React from "react";

function HeaderSettings({ activeTab, setActiveTab, renderTabContent }) {
  return (
    <div className="p-4">
      {/* Barre de navigation */}
      <div className="flex border-b pb-2">
        
      <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 ${activeTab === "logs" ? "border-none" : "rounded-none text-[var(--subfont-gray)] border-none bg-[#F9F9F9]"}`}
        >
          Logs
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 ${activeTab === "password" ? "border-none" : "rounded-none text-[var(--subfont-gray)] border-none bg-[#F9F9F9]"}`}
        >
          Mot de passe
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 ${activeTab === "settings" ? "border-none" : "rounded-none rounded-r-lg text-[var(--subfont-gray)] border-none bg-[#F9F9F9]"}`}
        >
          Paramétrage
        </button>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
}

export default HeaderSettings;