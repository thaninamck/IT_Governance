import React from 'react';
import './FormStyle.css';

function InputForm({ label, placeholder,type, width,flexDirection }) {
  return (
    <div className="input-form" style={{flexDirection}} >
      <label className="input-label">{label}</label>
      <input
        type={type}
        className="input-field"
        placeholder={placeholder}
        style={{ width }}
      />
    </div>
  );
}

export default InputForm;
