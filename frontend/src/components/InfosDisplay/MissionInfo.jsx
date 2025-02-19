import React from "react";
import InfoDisplayComponent from "./InfoDisplayComponent";
import AddEquipe from "./AddEquipe";
import DisplayEquipe from "./DisplayEquipe";
import Separator from "../Decorators/Separator";

const MissionInfo = ({dataFormat }) => {
  // Vérifier si dataFormat est défini pour éviter les erreurs
  if (!dataFormat) {
    return <p className="text-red-500">Aucune donnée disponible</p>;
  }
  //à ajouter comme parametre apres
  //juste pour le test
  const equipe = [
    { membre: "houda", role: "Manager" },
    { membre: "membre2", role: "Testeur" },
    { membre: "membre3", role: "Superviseur" },
    
  ];


  return (
    <div className="m-2 mb-8 overflow-x-scroll py-2 px-5 bg-white w-auto sm:w-auto sm:h-auto shadow-lg grid grid-cols-1 gap-x-3 gap-y-1 rounded-md">
    <InfoDisplayComponent
      label="Mission"
      BoxContent={dataFormat.mission|| "Non défini"}
      borderWidth={200}
      labelWidth={300}
    />
    <InfoDisplayComponent
      label="Client"
      BoxContent={dataFormat.client || "Non défini"}
      borderWidth={200}
      labelWidth={300}
    />
    <div className="flex relative flex-col sm:flex-row sm:gap-x-16">
      <InfoDisplayComponent
        label="Date début"
        BoxContent={dataFormat.dateField || "Non défini"}
        borderWidth={200}
        labelWidth={300}
      />
      <InfoDisplayComponent
        label="Date fin"
        BoxContent={dataFormat.dateField1 || "Non défini"}
        borderWidth={100}
        labelWidth={80}
      />
    </div>
    <InfoDisplayComponent
      label="Période auditée"
      BoxContent={
        dataFormat.periodeAuditee
          ? `Du ${dataFormat.periodeAuditee.debut} à ${dataFormat.periodeAuditee.fin}`
          : "Non défini"
      }
      borderWidth={220}
      labelWidth={300}
    />
      {equipe.length !== 0 ? (
        <>
          <DisplayEquipe equipe={equipe} />
        </>
      ) : (
        <AddEquipe />
      )}
    </div>
  );
};

export default MissionInfo;
