import React, { useState, useEffect } from "react";
import InfoDisplayComponent from "./InfoDisplayComponent";
import AddEquipe from "./AddEquipe";
import DisplayEquipe from "./DisplayEquipe";
import { api } from "../../Api";

const MissionInfo = ({ dataFormat, user , missionId}) => {
  // Charger les données depuis localStorage si `dataFormat` n'est pas fourni
 // États initiaux
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 const [missionData, setMissionData] = useState(
//   () => {
//   const savedData = localStorage.getItem("missionData");
//   return dataFormat || (savedData ? JSON.parse(savedData) : null);
// }
);

 const [equipe, setEquipe] = useState(
//   () => {
//    const savedEquipe = localStorage.getItem("equipeData");
//    if (savedEquipe) return JSON.parse(savedEquipe);
//    return dataFormat ? [{ membre: dataFormat.manager || "Non défini", role: "Manager" }] : [];
//  }
);



   // Fonction pour charger les données
   const fetchMissionData = async () => {
    try {
      const response = await api.get(`/missions/${missionId}/members`);
      setMissionData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   // Chargement initial
   useEffect(() => {
    if (missionId) {
      fetchMissionData();
    }
  }, [missionId]);

   // Rafraîchissement automatique après modification
   const handleTeamUpdate = () => {
    fetchMissionData();
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">Erreur: {error}</p>;
  if (!missionData) return <p className="text-red-500">Aucune donnée disponible</p>;
// Fonction pour ajouter un nouveau membre à l'état local
// const handleNewMemberAdded = (newMember) => {
//   setMissionData(prev => ({
//     ...prev,
//     members: [...prev.members, newMember]
//   }));
// };

// const handleMemberDeleted = (deletedParticipationId) => {
//   setMissionData(prev => ({
//     ...prev,
//     members: prev.members.filter(member => member.id !== deletedParticipationId)
//   }));
// };
  return (
    <div className="m-2 mb-8 overflow-x-scroll py-2 px-5 bg-white w-auto sm:w-auto sm:h-auto shadow-lg grid grid-cols-1 gap-x-3 gap-y-1 rounded-md">
      <InfoDisplayComponent
        label="Mission"
        BoxContent={missionData.mission_name || "Non défini"}
        borderWidth={200}
        labelWidth={300}
      />
      <InfoDisplayComponent
        label="Client"
        BoxContent={missionData.clientName || "Non défini"}
        borderWidth={200}
        labelWidth={300}
      />
      <div className="flex relative flex-col sm:flex-row sm:gap-x-16">
        <InfoDisplayComponent
          label="Date début"
          BoxContent={missionData.start_date || "Non défini"}
          borderWidth={200}
          labelWidth={300}
        />
        <InfoDisplayComponent
          label="Date fin"
          BoxContent={missionData.end_date || "Non défini"}
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
      <DisplayEquipe 
      equipe={missionData.members}
      missionId={missionData.id}
      user={user}
      //onMemberDeleted={handleMemberDeleted}
      onTeamUpdate={handleTeamUpdate}
       />

      {/* Ajout d'équipe uniquement pour les administrateurs et managers */}
      {(user?.role === "admin" /*|| userRole === "manager"*/ ) && (
        <AddEquipe  
        missionId={missionData.id}
        onMemberAdded={handleTeamUpdate}
       // onMemberAdded={handleNewMemberAdded}
        />
      )}
    </div>
  );
};

export default MissionInfo;
