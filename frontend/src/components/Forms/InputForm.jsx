import React, { useState } from 'react';
import './FormStyle.css';

function InputForm({
  label,
  placeholder,
  type = "text", // Par défaut "text"
  width,
  flexDirection,
  value,
  onChange,
  required = false,
  customStyle = "",
  minWidth = "100px",
  readOnly = false,
  multiline = false // Nouvelle prop pour activer le mode multiligne
}) {
  const [error, setError] = useState(false);

  const handleBlur = () => {
    if (required && !value) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <div className={` relative  flex flex-col ${flexDirection || ''} gap-1`}>
      <div className="flex items-center gap-2">
        <label className={`text-sm  ml-1 font-medium ${customStyle || ""}`}>{label}</label>
        {required && <span className="text-red-500">*</span>}
      </div>
      {error && <span className=" absolute  top-16 pt-1 text-red-500 text-[9px]">Ce champ est requis</span>}

      {multiline ? (
        <textarea
          className={`p-2 text-sm border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg placeholder:text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            readOnly ? 'bg-white' : 'bg-white'
          }`}
          placeholder={placeholder}
          style={{
            width: width || "100%",
            minWidth,
            minHeight: "80px", // Hauteur minimale pour le textarea
            resize: "none", // Empêche le redimensionnement manuel
          }}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          readOnly={readOnly}
          rows={3} // Nombre de lignes par défaut
        />
      ) : (
        <input
          type={type}
          className={`p-2 text-sm border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg placeholder:text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            readOnly ? 'bg-white' : 'bg-white'
          }`}
          placeholder={placeholder}
          style={{
            width: width || "100%",
            minWidth,
          }}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          readOnly={readOnly}
        />
      )}

      
    </div>
  );
}

export default InputForm;