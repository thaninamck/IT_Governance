import React, { useState } from 'react';

const EditableTextarea = ({ placeholder = 'Saisir un commentaire ...', onSave }) => {
  const [value, setValue] = useState('');
  const [showButton, setShowButton] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
    setShowButton(e.target.value.trim() !== '');
  };

  const handleSave = () => {
    onSave(value);
    setShowButton(false);
  };

  return (
    <div className="relative flex items-center border border-gray-300 rounded-lg overflow-hidden w-[89%]">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={3}
        className="w-full py-2 px-4 pr-20 text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring focus:ring-blue-300"
      />
      {showButton && (
        <button
          onClick={handleSave}
          className="absolute bottom-2 right-2 bg-[var(--blue-menu)] text-white text-sm font-medium py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition-all border-none"
        >
          Modifier
        </button>
      )}
    </div>
  );
};

export default EditableTextarea;
