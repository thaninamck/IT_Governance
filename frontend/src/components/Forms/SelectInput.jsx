import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Import de l'icône

function SelectInput({ label, options, value, onChange, width, flexDirection, customStyle }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col pt-2" style={{ flexDirection, width }}>
      {label && <label className={`text-sm mb-2 ml-1 ${customStyle || ""}`}>{label}</label>}

      {/* Sélecteur avec icône */}
      <div
        className="p-2 text-sm border border-gray-300 rounded-lg bg-white cursor-pointer flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{options.find(option => option.value === value)?.label || `${label}`}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Liste des options avec scroll */}
      {isOpen && (
        <div className="absolute mt-20 w-full max-h-[120px] overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-md z-10">
          {options.map((option, index) => (
            <div
              key={index}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                onChange({ target: { value: option.value } });
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectInput;
