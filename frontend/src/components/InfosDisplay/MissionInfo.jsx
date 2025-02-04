import React from "react";
import InfoDisplayComponent from "./InfoDisplayComponent";
import AddEquipe from "./AddEquipe";
import DisplayEquipe from "./DisplayEquipe";
import Separator from "../Decorators/Separator";

const MissionInfo = () => {
  //à ajouter comme parametre apres
  //juste pour le test
  const equipe = [
    { membre: "houda", role: "Manager" },
    { membre: "membre2", role: "Testeur" },
    { membre: "membre3", role: "Superviseur" },
  ];

  return (
    <div className=" absolute overflow-x-scroll m-1 py-4 px-20 bg-white w-auto sm:w-auto sm:h-auto  shadow-lg grid grid-cols-1 gap-x-3 gap-y-2 rounded-md ">
      <InfoDisplayComponent
        label={"Mission"}
        BoxContent={"DSP"}
        borderWidth={200}
        labelWidth={300}
      />
      <InfoDisplayComponent
        label={"Client"}
        BoxContent={"Djezzy"}
        borderWidth={200}
        labelWidth={300}
      />
      <div className="flex relative flex-col sm:flex-row  sm:gap-x-16">
        <InfoDisplayComponent
          label={"Date debut"}
          BoxContent={"21/08/2002"}
          borderWidth={200}
          labelWidth={300}
        />
        <InfoDisplayComponent
          label={"Date fin"}
          BoxContent={"21/08/2002"}
          borderWidth={200}
          labelWidth={100}
        />
       
      </div>
      <InfoDisplayComponent
        label={"periode auditée"}
        BoxContent={"du 21/08/2002 à 1/08/2002 "}
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
