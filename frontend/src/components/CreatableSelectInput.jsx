import React, { useState } from 'react';
import Select from 'react-select';
import { components } from 'react-select';

function CreatableSelectInput({
    options,
    value,
    onChange,
    label,
    width,
    required,
    multiSelect = false
  }) {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (newValue) => {
      setInputValue(newValue);
    };
  
    const handleKeyDown = (event) => {
      if (!inputValue) return;
      switch (event.key) {
        case 'Enter':
        case 'Tab':
          const newOption = { label: inputValue, value: inputValue };
          // Ajoute la nouvelle option à la liste
          onChange(multiSelect 
            ? [...value, newOption] 
            : newOption
          );
          setInputValue('');
          event.preventDefault();
      }
    };
  
    return (
      <div style={{ width: width || '100%' }} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <Select
          options={options}
          value={value}
          onChange={onChange}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          isMulti={multiSelect}
          isClearable
          isSearchable
          placeholder={`Sélectionnez ou tapez pour créer`}
          noOptionsMessage={() => "Tapez pour créer une nouvelle option"}
          components={{
            DropdownIndicator: (props) => (
              <components.DropdownIndicator {...props}>
                <div className="pr-2">+</div>
              </components.DropdownIndicator>
            ),
          }}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: '40px',
            }),
          }}
        />
      </div>
    );
}

export default CreatableSelectInput