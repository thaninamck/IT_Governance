import React from 'react';
import './FormStyle.css';

function InputForm({ label, placeholder, type, width, flexDirection, value, onChange,customStyle  }) {
  return (
    <div className={`flex  pt-2 ${ flexDirection } || ""`}>
      <label className={`text-sm mb-2 ml-1 ${customStyle} || ""`}>{label}</label>
      <input
        type={type}
        id="multi-line-input"
        className="p-2 text-sm border border-gray-300 rounded-lg placeholder:text-xs"
        placeholder={placeholder}
        style={{ width }}
        value={value} // Lier la valeur au parent
        onChange={onChange} // Remonter les modifications au parent
      />
    </div>

    
  );
}

export default InputForm;
