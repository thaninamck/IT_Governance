import { useState } from "react";
import { Check } from "lucide-react";

const options = ["IPE", "Design", "Effectiveness"];

export default function MultiSelectButtons() {
  const [selected, setSelected] = useState({});

  // Fonction pour gérer les changements d'état des boutons
  const toggleSelection = (option) => {
    setSelected((prevSelected) => {
      // Vérifier si "Design" est "Non Conform" et empêcher le changement de "Effectiveness"
      if (option === "Effectiveness" && prevSelected["Design"] === "Non Conform") {
        return prevSelected; // Ne pas permettre le changement
      }

      const currentState = prevSelected[option];
      const nextState =
        currentState === "Conform"
          ? "Non Conform"
          : currentState === "Non Conform"
          ? "Son État"
          : "Conform";

      const updatedSelection = {
        ...prevSelected,
        [option]: nextState,
      };

      // Si "Design" devient "Non Conform", alors "Effectiveness" est automatiquement mis à "Non Conform"
      if (option === "Design" && nextState === "Non Conform") {
        updatedSelection["Effectiveness"] = "Non Conform";
      }

      return updatedSelection;
    });
  };

  return (
    <div className="flex justify-between space-x-4 px-4 w-[540px]">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => toggleSelection(option)}
          disabled={option === "Effectiveness" && selected["Design"] === "Non Conform"} // Désactiver le bouton si Design est Non Conform
          className={`flex flex-col items-center px-4 py-2 rounded-md font-medium transition 
            ${
              selected[option] === "Conform"
                ? "bg-green-500 text-white border border-green-600"
                : selected[option] === "Non Conform"
                ? "bg-red-500 text-white border border-red-600"
                : "bg-[#D9D9D9] text-black border border-gray-400"
            }
            ${option === "Effectiveness" && selected["Design"] === "Non Conform" ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <div className="flex flex-row items-center font-medium">
            {(selected[option] === "Conform" || selected[option] === "Non Conform") && (
              <Check size={16} className="mr-4" color="#fff" />
            )}
            {option}
          </div>
          <span className="text-[8px]">{selected[option] || "Son État"}</span>
        </button>
      ))}
    </div>
  );
}
