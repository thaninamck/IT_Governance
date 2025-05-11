import React, { useEffect, useRef, useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';

function Remediation({ title, initialValues = {}, onAdd, idControle, onClose }) {
  const [open, setOpen] = useState(true);
  const isFirstRender = useRef(true);

  const [description, setDescription] = useState(initialValues?.description || '');
  const [owner_cntct, setContact] = useState(initialValues?.owner_cntct || '');
  const [status, setStatus] = useState(initialValues?.status || 'Non_commencee');
  const [start_date, setDateField] = useState(initialValues?.start_date || '');
  const [end_date, setDateField1] = useState(initialValues?.end_date || '');
  const [error, setError] = useState('');

  const handleClose = () => {
    onAdd({});
    onClose();
    setOpen(false);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      setDescription(initialValues.description || '');
      setContact(initialValues.owner_cntct || '');
      setStatus(initialValues.status || 'Non_commencee');
      setDateField(initialValues.start_date || '');
      setDateField1(initialValues.end_date || '');
      isFirstRender.current = false;
    }
  }, [initialValues]);

  const handleDateField1Change = (e) => {
    const selectedDate = e.target.value;
    if (new Date(selectedDate) < new Date(start_date)) {
      setError('La date de fin doit être postérieure à la date de début.');
      setDateField1('');
    } else {
      setError('');
      setDateField1(selectedDate);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !owner_cntct || !start_date || !end_date) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setError('');

    const formData = {
      id: initialValues?.id,
      description,
      owner_cntct,
      status: status || 'Non_commencee',
      start_date,
      end_date,
    };

    onAdd(formData);

    // reset form
    setDescription('');
    setContact('');
    setStatus('Non_commencee');
    setDateField('');
    setDateField1('');
  };

  const handleReset = () => {
    setDescription('');
    setContact('');
    setStatus('Non_commencee');
    setDateField('');
    setDateField1('');
    setError('');
  };

  return (
    open && (
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-6xl mx-auto mt-6 relative" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-2xl font-bold  border-none text-gray-500 hover:text-red-600"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InputForm
              type="text"
              label="Description"
              placeholder="Entrez la description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <InputForm
              type="email"
              label="Contact (Email)"
              placeholder="Ex: contact@example.com"
              value={owner_cntct}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            
          </div>

          <div>
            <InputForm
              type="date"
              label="Date de début"
              value={start_date}
              onChange={(e) => setDateField(e.target.value)}
              required
            />
            <InputForm
              type="date"
              label="Date de fin"
              value={end_date}
              onChange={handleDateField1Change}
              min={start_date}
              required
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 hover:bg-gray-400  border-none text-gray-700 font-medium py-2 px-4 rounded"
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 border-none text-white font-semibold py-2 px-4 rounded"
          >
            {initialValues?.id ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    )
  );
}

export default Remediation;
