import React, { useEffect, useState } from 'react';
import InputForm from './InputForm';
import Button from '../Button';
import AddButton from '../AddButton';
import SelectInput from './SelectInput';
import api from '../../Api';

import { Snackbar, Alert } from '@mui/material';

function AddSourceForm({ title, label,label1, placeholder, options, onAdd }) {
  const [selectedValue, setSelectedValue] = useState('');
  const [entityValue, setEntityValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState(options);
  const [loading, setLoading] = useState(true);
  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };
  
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const fetchStatuses = async () => {
    try {
      const response = await api.get('getstatus');
      console.log('status',response.data)
      setItems(response.data.map(item => ({
        label: item.statusName,
        value: item.id.toString(),
      }))); // Mettre à jour avec les données récupérées
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des statuts.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Vérifier si le code ou le nom existent déjà
    const entityExists = items.some(item => item.value === entityValue);
    const nameExists = items.some(item => item.label.toLowerCase() === nameValue.toLowerCase());

    if (entityExists && nameExists) {
      setError("Ce nom et entity existe déjà. Veuillez choisir un autre.");
      return;
    }

    if (entityValue.trim() !== '' && nameValue.trim() !== '') {
        try {
            const response = await api.post("createstatus", {
              status_name: nameValue,
              entity: entityValue,
            });
    
            const addedStatus = response.status;
            console.log('addedStatus',addedStatus)
            setItems((prev) => [...prev, addedStatus]);
            setEntityValue('');
            setNameValue('');
            setError('');
            onAdd(addedStatus); 
          } catch (err) {
            console.error('Erreur ajout :', err);
            setError("Une erreur est survenue lors de l'ajout.");
          }
    //   const newItem = { label: nameValue, value: entityValue };
    //   setItems([...items, newItem]);
    //   setEntityValue('');
    //   setNameValue('');
    //   setError('');
    //   onAdd(newItem); // Notifier le parent
    }
  };

  console.log('selected item',selectedValue)
  const handleDeleteClick = async (selectedValue) => {
    try {
      await api.delete(`deletestatus/${selectedValue}`);
      setItems((prev) => prev.filter((status) => status.id !== selectedValue));
    } catch (err) {
      console.error('Erreur suppression :', err);
      setError("Une erreur est survenue lors de la suppression.");
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
            isDelete={true}
           onDelete={handleDeleteClick}
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
            <div className='flex flex-col h-[110px]'>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <form className="flex flex-row items-center justify-between gap-6" onSubmit={handleSubmit}>
                <InputForm
                  type="text"
                  label={label1}
                  placeholder="Code "
                  width="120px"
                  flexDirection="flex-col"
                  value={entityValue}
                  onChange={(e) => {
                    setEntityValue(e.target.value);
                    setError('');
                  }}
                />
                <InputForm
                  type="text"
                  label={label}
                  placeholder={placeholder}
                  width="200px"
                 flexDirection="flex-col"
                  value={nameValue}
                  onChange={(e) => {
                    setNameValue(e.target.value);
                    setError('');
                  }}
                />
                <Button btnName="Enregistrer" type="submit" />
              </form>
            </div>
          </div>
        )}
      </div>
<Snackbar
        open={deleteConfirmationOpen}
        autoHideDuration={6000}
        onClose={cancelDelete}
      >
        <Alert
          severity="warning"
          onClose={cancelDelete}
          action={
            <>
              <button className='bg-[--blue-conf] text-white border-none p-1 mr-3' onClick={confirmDelete}>
                Confirmer
              </button>
              <button className=' border-[var(--alert-red)] px-2 py-1' onClick={cancelDelete}>
                Annuler
              </button>
            </>
          }
        >
          Êtes-vous sûr de vouloir supprimer cet élément ?
        </Alert>
      </Snackbar>

    </div>
  );
}

export default AddSourceForm;
