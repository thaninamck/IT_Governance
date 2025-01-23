import React from 'react';
import './FormStyle.css';

function InputForm({ label, placeholder, type, width, flexDirection, value, onChange }) {
  return (
    <div className="input-form" style={{ flexDirection }}>
      <label className="input-label">{label}</label>
      <input
        type={type}
        className="input-field"
        placeholder={placeholder}
        style={{ width }}
        value={value} // Lier la valeur au parent
        onChange={onChange} // Remonter les modifications au parent
      />
    </div>
  );
}

export default InputForm;
