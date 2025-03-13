import React, { useEffect, useState } from 'react';
import InputForm from './InputForm';
import Button from '../Button';
import AddButton from '../AddButton';
import SelectInput from './SelectInput';
import api from '../../Api';

function DynamicAddForm({ title, label, placeholder, onAdd ,fetchEndpoint, createEndpoint,labelKey = 'name',itemKey}) {
  const [selectedValue, setSelectedValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  // Charger les layers depuis le backend
  const fetchLayers = async () => {
    try {
      const response = await api.get(fetchEndpoint); // Assurez-vous que l'URL est correcte
      setItems(response.data.map(item => ({
        label: item[labelKey],
        value: item.id.toString(),
      })));
    } catch (error) {
      console.error('Erreur lors de la récupération des layers:', error);
    }
  };

  useEffect(() => {
    fetchLayers();
  }, [fetchEndpoint]);

  // Ajouter un layer
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const itemExists = items.some(item => item.label.toLowerCase() === inputValue.toLowerCase());
    if (itemExists) {
      setError("Cet élément existe déjà. Veuillez choisir un autre nom.");
      return;
    }

    try {
      const response = await api.post(createEndpoint, { name: inputValue });
      console.log(response)
      const newItem = { label: response.data[itemKey][labelKey], value: response.data[itemKey].id.toString() };

      setItems([...items, newItem]);
      setInputValue('');
      setError('');
      onAdd(newItem); // Notifier le parent
    } catch (error) {
      console.error('Erreur lors de l’ajout :', error);
      setError("Une erreur est survenue lors de l'ajout.");
    }
  };

  return (
    <div className='border-b border-gray-300 p-4'>
      <p className='font-bold'>{title}</p>
      <div className='flex flex-row items-center justify-between'>
        <div className="flex flex-row items-center justify-between gap-4 min-h-[120px] w-[360px]">
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
          <div className='flex flex-col w-[600px]'>
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
