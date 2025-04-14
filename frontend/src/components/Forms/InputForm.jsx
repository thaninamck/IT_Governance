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
    <div className={`flex flex-col ${flexDirection || ''} gap-2`}>
      <div className="flex items-center gap-2">
        <label className={`text-sm mb-1 ml-1 font-medium ${customStyle || ""}`}>{label}</label>
        {required && <span className="text-red-500">*</span>}
      </div>

      {multiline ? (
        <textarea
          className={`p-2 text-sm border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg placeholder:text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            readOnly ? 'bg-white' : 'bg-white'
          }`}
          placeholder={placeholder}
          style={{
            width: "100%",
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
            width: "100%",
            minWidth,
          }}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          readOnly={readOnly}
        />
      )}

      {error && <span className="text-red-500 text-xs mt-1">Ce champ est requis</span>}
    </div>
  );
}

export default InputForm;