import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

function SelectInput({
  label,
  options,
  value,
  onChange,
  width,
  flexDirection,
  customStyle,
  required = false,
  multiSelect = false,
  mt = 'mt-20',
  isDelete = false,
  onDelete,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const selectRef = useRef(null); // Référence pour le conteneur du SelectInput

  // Vérifier si la valeur sélectionnée est un tableau (pour multi-choix)
  const selectedValues = multiSelect ? (Array.isArray(value) ? value : []) : value;

  // Gérer la sélection d'une option
  const handleSelect = (option) => {
    if (multiSelect) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter((val) => val !== option.value) // Déselectionner
        : [...selectedValues, option.value]; // Ajouter

      onChange({ target: { value: newValues } });
    } else {
      onChange({ target: { value: option.value } });
      setIsOpen(false); // Fermer le menu après sélection
    }
  };

  // Gérer la perte de focus (pour le champ requis)
  const handleBlur = () => {
    if (required && !value) {
      setError(true);
    } else {
      setError(false);
    }
  };

  // Fermer le menu déroulant lors d'un clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false); // Fermer le menu
      }
    };

    // Ajouter l'écouteur d'événement
    document.addEventListener('mousedown', handleClickOutside);

    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex flex-col pt-2" style={{ flexDirection, width }} ref={selectRef}>
      <div className='flex items-center gap-2'>
        {label && <label className={`text-sm mb-2 ml-1 ${customStyle || ""}`}>{label}</label>}
        {required && <span className="text-[var(--alert-red)]">*</span>}
      </div>

      {/* Sélecteur principal */}
      <div
        className="p-2 text-sm border border-gray-300 rounded-lg bg-white cursor-pointer flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={handleBlur}
      >
        <span>
          {multiSelect
            ? options
                .filter(option => selectedValues.includes(option.value))
                .map(option => option.label)
                .join(", ") || label
            : options.find(option => option.value === value)?.label || `${label}`}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {error && <span className="text-red-500 text-xs mt-1">Ce champ est requis</span>}

      {/* Liste des options */}
      {isOpen && (
        <div className={`absolute ${mt} w-full max-h-[150px] overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-md z-10`}>
          {options.map((option, index) => (
            <div
              key={index}
              className="p-2 flex items-center justify-between cursor-pointer hover:bg-blue-100"
              onClick={() => handleSelect(option)}
            >
              {multiSelect && (
                <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center mr-2">
                  {selectedValues.includes(option.value) && <Check className="w-4 h-4 text-blue-500" />}
                </div>
              )}
              {option.label}
              {isDelete && (
                <button
                  className="border-none bg-transparent p-0 text-[25px] font-medium text-gray-800 cursor-pointer hover:text-red-500"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Empêcher la propagation de l'événement
                    onDelete(option.value); // Appeler la fonction onDelete avec la valeur de l'option
                  }}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectInput;