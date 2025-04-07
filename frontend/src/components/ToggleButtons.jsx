import { useState, useEffect } from "react";
import { Check } from "lucide-react";

const options = ["IPE", "Design", "Effectiveness"];

export default function MultiSelectButtons({ onSelectionChange, selections }) {
  const [selected, setSelected] = useState(selections || {});

  // Met à jour l'état local lorsque les props changent
  useEffect(() => {
    if (selections) {
      setSelected(selections);
    }
    
  }, [selections]);

  // Fonction pour gérer les changements d'état des boutons
  const toggleSelection = (option) => {
    setSelected((prevSelected) => {
      // Vérifier si "Design" est "Non Conform" et empêcher le changement de "Effectiveness"
      if (option === "Effectiveness" && prevSelected["Design"] === "Non Conform") {
        return prevSelected; // Ne pas permettre le changement
      }

      const currentState = prevSelected[option];
      const nextState =
        currentState === "Conforme"
          ? "Non Conforme"
          : currentState === "Non Conforme"
          ? "État"
          : "Conforme";

      const updatedSelection = {
        ...prevSelected,
        [option]: nextState,
      };

      // Si "Design" devient "Non Conform", alors "Effectiveness" est automatiquement mis à "Non Conform"
      if (option === "Design" && nextState === "Non Conforme") {
        updatedSelection["Effectiveness"] = "Non Conforme";
      }

       // Convertir l'objet en tableau de tuples [value, status]
       const selectionArray = Object.entries(updatedSelection).map(([key, value]) => [key, value]);

      // Appel de la fonction parent pour transmettre les nouvelles sélections
      onSelectionChange(selectionArray);
     // console.log(updatedSelection)
      return updatedSelection;
     
    });
  };

  return (
    <div className="flex justify-between space-x-4 px-4 w-[45%]">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => toggleSelection(option)}
          disabled={option === "Effectiveness" && selected["Design"] === "Non Conforme"} // Désactiver le bouton si Design est Non Conform
          className={`flex flex-col items-center px-4 py-2 rounded-md font-medium transition w-[200px]
            ${
              selected[option] === "Conforme"
                ? "bg-green-500 text-white border border-green-600"
                : selected[option] === "Non Conforme"
                ? "bg-red-500 text-white border border-red-600"
                : "bg-[#D9D9D9] text-black border border-gray-400"
            }
            ${option === "Effectiveness" && selected["Design"] === "Non Conforme" ? "opacity-50 cursor-not-allowed" : ""}
          `}>
          <div className="flex flex-row items-center font-medium">
            {(selected[option] === "Conforme" || selected[option] === "Non Conforme") && (
              <Check size={16} className="mr-4" color="#fff" />
            )}
            {option}
          </div>
          <span className="text-[8px]">{selected[option] || "État"}</span>
        </button>
      ))}
    </div>
  );
}
