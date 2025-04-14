import { useState, useEffect } from "react";
import { Check } from "lucide-react";

const options = ["IPE", "Design", "Effectiveness"];

export default function MultiSelectButtons({ onSelectionChange, selections,onStatesChange }) {
  const [selected, setSelected] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser l'état local une seule fois à partir des props
  useEffect(() => {
    if (selections && !isInitialized) {
      const convertedSelections = Object.fromEntries(
        Object.entries(selections).map(([key, value]) => [
          key,
          value ? "Conforme" : "Non Conforme",
        ])
      );
      setSelected(convertedSelections);
      setIsInitialized(true); // Ne plus réinitialiser après
    }
  }, [selections, isInitialized]);

  // Fonction de changement de sélection
  const toggleSelection = (option) => {
    setSelected((prevSelected) => {
      if (option === "Effectiveness" && prevSelected["Design"] === "Non Conforme") {
        return prevSelected;
      }
  
      const currentState = prevSelected[option];
      const nextState =
        currentState === "Conforme"
          ? "Non Conforme"
          : currentState === "Non Conforme"
          ? "Conforme"
          : "Conforme";
  
      const updatedSelection = {
        ...prevSelected,
        [option]: nextState,
      };
  
      // Si "Design" devient "Non Conforme", alors "Effectiveness" est automatiquement mis à "Non Conforme"
      if (option === "Design" && nextState === "Non Conforme") {
        updatedSelection["Effectiveness"] = "Non Conforme";
      }
  
      // 👉 Transformer en booléens pour le parent
      const selectionForParent = Object.fromEntries(
        Object.entries(updatedSelection).map(([key, value]) => [key, value === "Conforme"])
      );
  
      onSelectionChange(selectionForParent); // 👈 Tu envoies ceci au parent
      console.log("Updated Selection (for parent):", selectionForParent);
  onStatesChange(selectionForParent) 
      return updatedSelection; 
    });
  };
  

  return (
    <div className="flex justify-between space-x-4 px-4 w-[45%]">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => toggleSelection(option)}
          disabled={option === "Effectiveness" && selected["Design"] === "Non Conforme"}
          className={`flex flex-col items-center px-4 py-2 rounded-md font-medium transition w-[200px]
            ${
              selected[option] === "Conforme"
                ? "bg-green-500 text-white border border-green-600"
                : selected[option] === "Non Conforme"
                ? "bg-red-500 text-white border border-red-600"
                : "bg-[#D9D9D9] text-black border border-gray-400"
            }
            ${option === "Effectiveness" && selected["Design"] === "Non Conforme"
              ? "opacity-50 cursor-not-allowed"
              : ""}
          `}
        >
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
