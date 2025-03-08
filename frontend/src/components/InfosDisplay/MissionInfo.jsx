import React, { useState, useEffect } from "react";
import InfoDisplayComponent from "./InfoDisplayComponent";
import AddEquipe from "./AddEquipe";
import DisplayEquipe from "./DisplayEquipe";

const MissionInfo = ({ dataFormat, userRole }) => {
  // Charger les données depuis localStorage si `dataFormat` n'est pas fourni
  const [missionData, setMissionData] = useState(() => {
    const savedData = localStorage.getItem("missionData");
    return dataFormat || (savedData ? JSON.parse(savedData) : null);
  });

  // Charger l'équipe depuis localStorage ou initialiser avec le manager
  const [equipe, setEquipe] = useState(() => {
    const savedEquipe = localStorage.getItem("equipeData");
    if (savedEquipe) return JSON.parse(savedEquipe);

    return dataFormat ? [{ membre: dataFormat.manager || "Non défini", role: "Manager" }] : [];
  });

  // Sauvegarder `missionData` et `equipe` dans localStorage à chaque mise à jour
  useEffect(() => {
    if (dataFormat) {
      localStorage.setItem("missionData", JSON.stringify(dataFormat));
      setMissionData(dataFormat);
    }
  }, [dataFormat]);

  useEffect(() => {
    localStorage.setItem("equipeData", JSON.stringify(equipe));
  }, [equipe]);

  // Vérifier si `missionData` est défini pour éviter les erreurs
  if (!missionData) {
    return <p className="text-red-500">Aucune donnée disponible</p>;
  }

  // Fonction pour ajouter des collaborateurs à l'équipe
  const handleAddCollaborators = (newCollaborators) => {
    setEquipe((prevEquipe) => [...prevEquipe, ...newCollaborators]);
  };

  return (
    <div className="m-2 mb-8 overflow-x-scroll py-2 px-5 bg-white w-auto sm:w-auto sm:h-auto shadow-lg grid grid-cols-1 gap-x-3 gap-y-1 rounded-md">
      <InfoDisplayComponent
        label="Mission"
        BoxContent={missionData.mission || "Non défini"}
        borderWidth={200}
        labelWidth={300}
      />
      <InfoDisplayComponent
        label="Client"
        BoxContent={missionData.client || "Non défini"}
        borderWidth={200}
        labelWidth={300}
      />
      <div className="flex relative flex-col sm:flex-row sm:gap-x-16">
        <InfoDisplayComponent
          label="Date début"
          BoxContent={missionData.dateField || "Non défini"}
          borderWidth={200}
          labelWidth={300}
        />
        <InfoDisplayComponent
          label="Date fin"
          BoxContent={missionData.dateField1 || "Non défini"}
          borderWidth={100}
          labelWidth={80}
        />
      </div>
      <InfoDisplayComponent
        label="Période auditée"
        BoxContent={`Du ${missionData.auditStartDate} à ${missionData.auditEndDate}` || "Non défini"}
        borderWidth={220}
        labelWidth={300}
      />

      {/* Affichage de l'équipe */}
      <DisplayEquipe equipe={equipe} />

      {/* Ajout d'équipe uniquement pour les administrateurs et managers */}
      {(userRole === "admin" || userRole === "manager") && (
        <AddEquipe onAddCollaborators={handleAddCollaborators} />
      )}
    </div>
  );
};

export default MissionInfo;
