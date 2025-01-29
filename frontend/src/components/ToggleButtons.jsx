import { useState } from "react";
import { Check } from "lucide-react";

const options = ["IPE", "Design", "Effectiveness"];

export default function MultiSelectButtons() {
  const [selected, setSelected] = useState([]);

  const toggleSelection = (option) => {
    setSelected((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option) // Désélection
        : [...prevSelected, option] // Sélection
    );
  };

  return (
    <div className="flex justify-between space-x-4  px-4 w-[540px]">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => toggleSelection(option)}
          className={`flex items-center px-4 py-2 rounded-md font-medium transition 
            ${
              selected.includes(option)
                ? "bg-[--blue-nav] border border-[--blue-conf] text-[--font-gray]"
                :"border-[transparent] bg-[#D9D9D9]"
            }
          `}
        >
          {selected.includes(option) && <Check size={16} className="mr-4" color="#0071FF" />}
          {option}
        </button>
      ))}
    </div>
  );
}
