import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import InfoDisplayComponent from "../InfosDisplay/InfoDisplayComponent";
import TextDisplay from "./TextDisplay";
import Separator from "../Decorators/Separator";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useReferentiel from "../../Hooks/useReferentiel";
import SingleOptionSelect from "../Selects/SingleOptionSelect";
import MultiOptionSelect from "../Selects/MultiOptionSelect";
const ControlModalWindow = ({
  isOpen,
  onClose,
  infosCntrl,
  onControlUpdated,
}) => {
  const { typeOptions, sourceOptions } = useReferentiel();
  // États pour gérer les données avec leur code
  const [CntrlDescription, setCntrlDescription] = useState(
    infosCntrl.CntrlDescription
  );
  const [TestScript, setTestScript] = useState(infosCntrl.TestScript || "");
  const [MajorProcess, setMajorProcess] = useState(
    infosCntrl.MajorProcess.Designation || ""
  );
  const [MajorProcessCode, setMajorProcessCode] = useState(
    infosCntrl.MajorProcess.Code || ""
  );
  const [SubProcess, setSubProcess] = useState(
    infosCntrl.SubProcess.Designation || ""
  );
  const [SubProcessCode, setSubProcessCode] = useState(
    infosCntrl.SubProcess.Code || ""
  );
  const types = typeOptions.map((option) => [option.id, option.name]);

  const Sources = sourceOptions.map((option) => [option.id, option.name]);
  console.log("Sources", Sources);
  // const types = [
  //   [1, "préventif"],
  //   [2, "détéctif"],
  // ];

  const [sources, setSources] = useState(infosCntrl.Sources || []);
  const [type, setType] = useState(infosCntrl.Type || []);
  // Fonction pour mettre à jour "type"
  const handleSetType = (newType) => {
    setType(newType); // Remplace directement la valeur de "type"
  };
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Mettre à jour les champs si infosCntrl change
    setCntrlDescription(infosCntrl.CntrlDescription);
    setTestScript(infosCntrl.TestScript);
    setMajorProcess(infosCntrl.MajorProcess.Designation);
    setMajorProcessCode(infosCntrl.MajorProcess.Code);
    setSubProcess(infosCntrl.SubProcess.Designation);
    setSubProcessCode(infosCntrl.SubProcess.Code);
    setSources(infosCntrl.Sources);
    setType(infosCntrl.Type);
  }, [infosCntrl]);

  // Fonction pour gérer les changements de la description
  const handleDescriptionChange = (newDescription, field) => {
    switch (field) {
      case "CntrlDescription":
        setCntrlDescription(newDescription);
        break;
      case "TestScript":
        setTestScript(newDescription);
        break;
      case "MajorProcess":
        setMajorProcess(newDescription);
        break;
      case "SubProcess":
        setSubProcess(newDescription);
        break;
      case "Type":
        handleSetType(newDescription);
        break;
      case "Sources":
        setSources(newDescription);
        break;
      default:
        break;
    }
  };

  const EnableEdit = () => {
    setIsEditing(true);
  };

  const DisableEdit = () => {
    setIsEditing(false);
  };

  const handleSubmitEdit = () => {
    DisableEdit();
    const formattedData = {
       
      description: CntrlDescription,
      testScript: TestScript,
      majorProcess: MajorProcess,
      majorProcessCode: MajorProcessCode,
      subProcess: SubProcess,
      subProcessCode: SubProcessCode,
      sources: sources, // Assurez-vous que c'est bien un tableau de [id, "Nom"]
      type: type, // Vérifiez que c'est bien sous forme [id, "Nom du type"]
    };

    onControlUpdated(formattedData,infosCntrl.id,);
    onClose();
  };

  return (
    <div
      className={`fixed w-full min-h-screen bg-gray-600 bg-opacity-50 z-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      {/* Contenu de la fenêtre */}
      <div
        className={`bg-white  w-auto overflow-y-auto max-h-[98vh] rounded-lg shadow-lg p-6 fixed top-1/2 right-2 -translate-y-1/2 ${
          isOpen ? "animate-slideInRight" : "animate-slideOutRight"
        }`}
      >
        {/* Bouton de fermeture */}
        <div
          className="absolute top-0 right-0 bg-transparent rounded-full text-blue mr-1"
          onClick={onClose}
        >
          <CloseIcon
            sx={{
              color: "#4F4F4F",
              width: "12px",
              height: "12px",
              ":hover": { cursor: "pointer" },
            }}
            className="mx-1"
          />
        </div>

        {/* Contenu de la modale */}
        <div className="flex flex-col items-start gap-4">
          <h2 className="font-semibold text-xl text-font-gray">
            Détails du Contrôle :
          </h2>

          {/* Affichage du code */}
          <InfoDisplayComponent
            borderWidth={60}
            label={"Code:"}
            BoxContent={infosCntrl.Code}
            labelWidth={120}
          />

          <div className="flex gap-5 mt-6">
            <label
              htmlFor="Type"
              className="w-[120px] text-font-gray font-medium"
            >
              Type:
            </label>
            <div className="flex flex-col gap-1 w-full">
              {!isEditing ? (
                // Mode affichage
                <InfoDisplayComponent
                  borderWidth={80}
                  label={""}
                  BoxContent={type[1]} // Affiche le libellé du type
                  labelWidth={30}
                />
              ) : (
                <div className="flex gap-2">
                  {/* Mode édition */}
                  <SingleOptionSelect
                    placeholder={""}
                    width={300}
                    statuses={types} // Liste complète des sources
                    onChange={(id, status) => {
                      // Mise à jour de la valeur de "Type"
                      handleDescriptionChange([id, status], "Type");
                    }}
                    checkedStatus={type} // Statut actuel de "Type"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Champ texte éditable */}
          <TextDisplay
            label="Description:"
            content={CntrlDescription}
            isEditing={isEditing}
            onContentChange={(newDescription) =>
              handleDescriptionChange(newDescription, "CntrlDescription")
            }
            borderWidth="450px"
            labelWidth="120px"
          />
          <TextDisplay
            label="Test Script:"
            content={TestScript}
            isEditing={isEditing}
            onContentChange={(newDescription) =>
              handleDescriptionChange(newDescription, "TestScript")
            }
            borderWidth="450px"
            labelWidth="120px"
          />

          <div className="flex gap-5 mt-6">
            <label
              htmlFor="Sources"
              className="w-[120px] text-font-gray font-medium"
            >
              Sources:
            </label>

            <div className="flex flex-col gap-1 w-full">
              {isEditing
                ? // Mode édition : Édition des sources
                  (console.log("sources", sources),
                  (
                    <MultiOptionSelect
                      placeholder="Sélectionnez les sources"
                      width={300}
                      height={40}
                      objects={Sources.map(([id, status]) => ({ id, status }))}
                      defaultSelected={infosCntrl.Sources} // Options sélectionnées par défaut
                      onSelectionChange={(selected) => {
                        // Mise à jour des sources sélectionnées
                        handleDescriptionChange(selected, "Sources");
                      }}
                    />
                  ))
                : // Mode affichage : Affichage des sources en lecture seule
                  sources.map((source, index) => (
                    <InfoDisplayComponent
                      key={index}
                      borderWidth={80}
                      label={""}
                      BoxContent={source[1]}
                      labelWidth={30}
                    />
                  ))}
            </div>
          </div>
          <Separator text={"Major Process"} />
          <InfoDisplayComponent
            borderWidth={50}
            label={"Code:"}
            BoxContent={MajorProcessCode}
            labelWidth={120}
          />
          <TextDisplay
            label="Designation:"
            content={MajorProcess}
            isEditing={isEditing}
            onContentChange={(newDescription) =>
              handleDescriptionChange(newDescription, "MajorProcess")
            }
            borderWidth="450px"
            labelWidth="120px"
          />

          <Separator text={"Sub Process"} />
          <InfoDisplayComponent
            borderWidth={50}
            label={"Code:"}
            BoxContent={SubProcessCode}
            labelWidth={120}
          />
          <TextDisplay
            label="Designation:"
            content={SubProcess}
            isEditing={isEditing}
            onContentChange={(newDescription) =>
              handleDescriptionChange(newDescription, "SubProcess")
            }
            borderWidth="450px"
            labelWidth="120px"
          />
        </div>

        {/* Boutons centrés */}
        <div className="flex justify-center gap-4 mt-4">
          {isEditing ? (
            <button
              onClick={handleSubmitEdit}
              className="px-4 py-2 bg-blue-menu text-white rounded-md hover:bg-blue-600"
            >
              Valider
            </button>
          ) : (
            <button
              onClick={EnableEdit}
              className="px-4 py-2 bg-blue-menu text-white rounded-md hover:bg-gray-400"
            >
              Modifier
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlModalWindow;
