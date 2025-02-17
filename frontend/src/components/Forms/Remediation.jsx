import React, { useEffect, useRef, useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function Remediation({ title , initialValues = {}, onAdd}) {
  const [open, setOpen] = useState(true);
  const isFirstRender = useRef(true);

  // États pour chaque champ
  const [description, setDescription] = useState(initialValues?.description || '');
  const [contact, setContact] = useState(initialValues?.contact || '');
  const [status, setStatus] = useState(initialValues?.status || '');
  const [dateField, setDateField] = useState(initialValues?.dateField || '');
  const [dateField1, setDateField1] = useState(initialValues?.dateField1 || '');

  const handleClose = () => {
    setOpen(false);
  };

  // Mettre à jour les états si initialValues change
  useEffect(() => {
    if (isFirstRender.current) {
      setDescription(initialValues.description || '');
      setContact(initialValues.contact || '');
      setStatus(initialValues.status || 'non_commencee');
      setDateField(initialValues.dateField || '');
      setDateField1(initialValues.dateField1 || '');
      isFirstRender.current = false;
    }
  }, [initialValues]);

  

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      id: initialValues?.id || Date.now(),
      description,
      contact,
      status:status||'non_commencee',
      dateField,
      dateField1,
    };
    onAdd(formData);
    setDescription('');
    setContact('');
    setDuree('');
    setDateField('');
    setDateField1('');
    console.log('Form Data:', formData);
    alert('Remédiation envoyée avec succès !');
  };

  return (
    open && (
      <form className="mr-3 ml-2 pr-4 pl-5  mt-3 relative pb-10 bg-gray-100" onSubmit={handleSubmit}>
        <div className="flex justify-end">
          <button
            className="border-none bg-transparent p-0 text-[30px] font-medium text-gray-800 cursor-pointer hover:text-red-500"
            type="button"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>

        <p className="font-medium mb-8 text-lg">{title}</p>
        <div className='flex flex-row gap-7'>
        <div>
        <InputForm
          type="text"
          label="Description"
          placeholder="Entrez la description de la remédiation..."
          width="600px"
          flexDirection="flex-row gap-5 items-center mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <InputForm
          type="email"
          label="Contact"
          placeholder="Entrez l'e-mail de la personne concernée..."
          width="600px"
          flexDirection="flex-row gap-12 items-center mb-2"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        </div>
        <div>
        <InputForm
          type="date"
          label="Date Début"
          width="200px"
          flexDirection="flex-row gap-9 items-center mb-2"
          value={dateField}
          onChange={(e) => setDateField(e.target.value)}
        />
        
        <InputForm
          type="date"
          label="Date Fin"
          width="200px"
          flexDirection="flex-row gap-14 items-center mb-2"
          value={dateField1}
          onChange={(e) => setDateField1(e.target.value)}
        />
        </div>
        </div>

        <div className="absolute bottom-2 right-2">
          <button
            className="px-4 mr-5 mb-4 py-1 bg-[var(--blue-menu)] text-white border-none rounded hover:bg-blue-700"
            type="submit"
          >
            Créer
          </button>
        </div>
      </form>
    )
  );
}

export default Remediation;
