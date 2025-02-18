import React, { useState } from 'react';
import InputForm from './InputForm';
import Button from '../Button';
import AddButton from '../AddButton';
import SelectInput from './SelectInput';

function DynamicAddForm({ title, label, placeholder, options, onAdd }) {
  const [selectedValue, setSelectedValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState(options);

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemExists = items.some(item => item.label.toLowerCase() === inputValue.toLowerCase());
    
    if (itemExists) {
      setError("Cet élément existe déjà. Veuillez choisir un autre nom.");
      return;
    }

    if (inputValue.trim() !== '') {
      const newItem = { label: inputValue, value: Date.now().toString() };
      setItems([...items, newItem]);
      setInputValue('');
      setError('');
      onAdd(newItem); // Notifier le parent
    }
  };

  return (
    <div className='border-b border-gray-300  p-4'>
      <p className='font-bold'>{title}</p>
      <div className='flex flex-row items-center justify-between'>
      <div className="flex flex-row items-center justify-between gap-4 min-h-[120px]  w-[360px]">
        <SelectInput
          label={label}
          options={items}
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          width="200px"
          customStyle="font-bold"
        />
        <AddButton title={`Ajouter ${label}`} onClick={() => setShowForm(true)} />
      </div>

      {showForm && (
        <div className='flex flex-col w-[600px] '>
          <div className='flex justify-end'>
            <button
              className="border-none bg-transparent p-0 text-[25px] font-medium text-gray-800 cursor-pointer hover:text-red-500"
              type="button"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
          </div>
          <div className='flex flex-col h-[110px] w-[400px]'>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <form className="flex flex-row items-center justify-between" onSubmit={handleSubmit}>
              <InputForm
                type="text"
                label={label}
                placeholder={placeholder}
                width="200px"
                flexDirection="flex-col"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError('');
                }}
              />
              <Button btnName="Enregistrer" type="submit" />
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default DynamicAddForm;
