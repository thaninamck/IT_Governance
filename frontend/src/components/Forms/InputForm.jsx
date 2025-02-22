import React, { useState } from 'react';
import './FormStyle.css';

function InputForm({ label, placeholder, type, width, flexDirection, value, onChange,required=false ,customStyle  }) {
  const [error, setError] = useState(false);

  // Vérifie si l'utilisateur quitte le champ sans remplir un champ obligatoire
  const handleBlur = () => {
    if (required && !value) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <div className={`flex  pt-2 ${ flexDirection } || ""`}>
<div className='flex items-center gap-2'>
      <label className={`text-sm mb-2 ml-1 ${customStyle} || ""`}>{label}</label>
      {required && <span className="text-[var(--alert-red)]">*</span>}
      </div>
      <input
        type={type}
        //id="multi-line-input"
        className={`p-2 text-sm border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg placeholder:text-xs text-gray-500`}
        placeholder={placeholder}
        style={{ width }}
        value={value} // Lier la valeur au parent
        onChange={onChange} // Remonter les modifications au parent
        onBlur={handleBlur} // Vérifie si le champ est vide après avoir perdu le focus
      />
       {error && <span className="text-red-500 text-xs mt-1">Ce champ est requis</span>}
    </div>

    
  );
}

export default InputForm;
