import React, { useEffect, useRef, useState } from 'react';
import InputForm from './InputForm';
import CreatableSelectInput from '../CreatableSelectInput';
import { api } from '../../Api';

function NewAppForm({ title, initialValues = {}, onAddApp, onClose }) {
  const isFirstRender = useRef(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [owner_id, setOwnerId] = useState('');
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [LayerOptions, setLayerOptions] = useState([]);

  useEffect(() => {
    const fetchLayers = async () => {
      try {
        const response = await api.get('/getlayers');
        const options = response.data.map(layer => ({
          label: layer.name,
          value: layer.id,
        }));
        setLayerOptions(options);
      } catch (error) {
        console.error('Erreur lors de la récupération des couches', error);
      }
    };

    fetchLayers();
    if (isFirstRender.current) {
      resetFormWithInitialValues();
      isFirstRender.current = false;
    }
  }, [initialValues]);

  const resetFormWithInitialValues = () => {
    setName(initialValues.name || '');
    setDescription(initialValues.description || '');
    setFullName(initialValues.full_name || '');
    setEmail(initialValues.email || '');
    setOwnerId(initialValues.owner_id || '');
    setSelectedMulti(initialValues.layerName || []);
  };

  const handleClose = () => {
    resetFormWithInitialValues();
    onAddApp({});
    onClose();
  };

  const handleLayerChange = (selectedOptions) => {
    const updatedSelection = selectedOptions?.map(option => ({
      label: option.label,
      value: option.value || option.label
    })) || [];
    setSelectedMulti(updatedSelection);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedLayers = selectedMulti.map(layer => layer.label);
    const formData = {
      id: initialValues?.id,
      name,
      description,
      full_name,
      email,
      owner_id,
      layerName: formattedLayers,
    };

    onAddApp(formData);
    setError('');
    setName('');
    setDescription('');
    setFullName('');
    setEmail('');
    setOwnerId('');
    setSelectedMulti([]);
  };

  return (
    <form onSubmit={handleSubmit} className="relative mt-2 bg-white rounded-xl px-6 py-4 shadow-md w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
        <button
          type="button"
          onClick={handleClose}
          className="text-2xl text-gray-500 border-none hover:text-red-600 font-bold"
        >
          &times;
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {/* Form Inputs */}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <InputForm
            type="text"
            label="Nom de l'application / système"
            placeholder="Entrez le nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <InputForm
            type="text"
            label="Description"
            placeholder="Entrez la description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-4">
          <InputForm
            type="text"
            label="Owner"
            placeholder="Nom du propriétaire"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <InputForm
            type="email"
            label="Contact"
            placeholder="Email du owner"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Layers Select */}
      <div className="mt-6">
        <CreatableSelectInput
          label="Couches"
          options={LayerOptions}
          value={selectedMulti}
          onChange={handleLayerChange}
          required
          multiSelect
          width="100%"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-[var(--blue-menu)] border-none hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
        >
          {initialValues?.id ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
}

export default NewAppForm;
