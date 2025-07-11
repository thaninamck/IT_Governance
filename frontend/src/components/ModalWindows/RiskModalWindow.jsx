import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import InfoDisplayComponent from "../InfosDisplay/InfoDisplayComponent";
import TextDisplay from "./TextDisplay";
import useReferentiel from "../../Hooks/useReferentiel";
const RiskModalWindow = ({ isOpen, onClose, infosRisk, onUpdateRisk }) => {
  // États pour gérer les données avec leur code
  const [Description, setDescription] = useState(infosRisk.Description);
  const [Code, setCode] = useState(infosRisk.Code || "");
  const [Nom, setNom] = useState(infosRisk.Nom || "");
  const [isEditing, setIsEditing] = useState(false); // État d'édition
  const [id, setId] = useState(infosRisk.id);
  useEffect(() => {
    // Mettre à jour les champs si infosRisk change
    setDescription(infosRisk.Description);
    setNom(infosRisk.Nom);
    setCode(infosRisk.Code);
    setId(infosRisk.id);
  }, [infosRisk]);

  const handleDescriptionChange = (newDescription, field) => {
    switch (field) {
      case "RiskDescription":
        setDescription(newDescription);
        break;
      case "Nom":
        setNom(newDescription);
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
  const { loading, updateRisk } = useReferentiel();

  const handleSubmitEdit = async () => {
    DisableEdit();

    console.log("Risk ID:", id); // Vérifie l'ID avant d'envoyer la requête

    const updatedData = {
      description: Description,
      name: Nom,
      code: Code,
    };

    await onUpdateRisk(id, updatedData);
  };

  return (
    <div
      className={`fixed w-full min-h-screen bg-gray-600 bg-opacity-50 z-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      {/* Contenu de la fenêtre */}
      <div
        className={`bg-white w-auto overflow-y-auto max-h-[80vh] rounded-lg shadow-lg p-6 fixed top-1/2 right-2 -translate-y-1/2 ${
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
            Détails du Risque :
          </h2>

          {/* Affichage du code */}
          <div className="flex gap-5 my-6 items-start">
            <label className="w-[100px] text-font-gray font-medium">
              Code:
            </label>

            <InfoDisplayComponent
              borderWidth={25}
              label={""}
              BoxContent={Code}
              labelWidth={60}
            />
          </div>
          {/* Champ texte éditable */}
          <TextDisplay
            label="Nom:"
            content={Nom}
            isEditing={isEditing}
            onContentChange={(newDescription) =>
              handleDescriptionChange(newDescription, "Nom")
            }
            borderWidth="450px"
            labelWidth="120px"
          />
          <TextDisplay
            label="Description:"
            content={Description}
            isEditing={isEditing}
            onContentChange={(newDescription) =>
              handleDescriptionChange(newDescription, "RiskDescription")
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

export default RiskModalWindow;
