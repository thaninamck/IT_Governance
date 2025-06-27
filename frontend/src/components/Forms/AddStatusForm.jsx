import React, { useEffect, useState } from 'react';
import InputForm from './InputForm';
import Button from '../Button';
import AddButton from '../AddButton';
import SelectInput from './SelectInput';

import { Snackbar, Alert } from '@mui/material';
import { toast } from "react-toastify";
import { api } from '../../Api';

function AddStatusForm({ title, label, label1, placeholder, options, onAdd }) {
  const [selectedValue1, setSelectedValue1] = useState('');
  const [selectedValueEntity, setSelectedValueEntity] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [entityOptions, setEntityOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };

  const fetchStatuses = async () => {
    try {
      const response = await api.get('getstatus');
      const data = response.data;

      const formattedItems = data.map(item => ({
        label: item.statusName,
        value: item.id.toString(),
        entity: item.entity
      }));

      const uniqueEntities = [...new Set(data.map(item => item.entity))]
        .filter(Boolean)
        .map(entity => ({
          label: entity,
          value: entity
        }));

      setItems(formattedItems);
      setEntityOptions(uniqueEntities);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des statuts.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
  
    if (!nameValue || !selectedValueEntity) {
      setError("Veuillez remplir tous les champs.");
      setIsSubmitting(false);
      return;
    }
  
    const nameExists = items.some(
      item =>
        item.label.toLowerCase() === nameValue.toLowerCase() &&
        item.entity === selectedValueEntity
    );
  
    if (nameExists) {
      setError("Ce nom et entity existent déjà. Veuillez choisir un autre.");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await api.post("createstatus", {
        status_name: nameValue,
        entity: selectedValueEntity,
      });
  
      const addedStatus = response.data;
  
      setItems(prev => [
        ...prev,
        {
          label: addedStatus.status_name,
          value: addedStatus.id,
          entity: addedStatus.entity,
        }
      ]);
  
      await fetchStatuses();
  
      if (!entityOptions.find(ent => ent.value === addedStatus.entity)) {
        setEntityOptions(prev => [...prev, { label: addedStatus.entity, value: addedStatus.entity }]);
      }
  
      setNameValue('');
      setSelectedValueEntity('');
      setShowForm(false);
      onAdd(addedStatus);
      toast.success("Statut ajouté avec succès !");
    } catch (err) {
      console.error('Erreur ajout :', err);
      setError("Une erreur est survenue lors de l'ajout.");
      toast.error("Une erreur est survenue lors de l'ajout.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleDeleteClick = (value) => {
    setItemToDelete(value);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`deletestatus/${itemToDelete}`);
      setItems(items.filter(item => item.value !== itemToDelete));
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      setError("Une erreur est survenue lors de la suppression.");
    } finally {
      cancelDelete();
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
            value={selectedValue1}
            onChange={(e) => setSelectedValue1(e.target.value)}
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
              <form className="flex flex-row items-end justify-between gap-6" onSubmit={handleSubmit}>
                <SelectInput
                  label="Entité"
                  options={entityOptions}
                  value={selectedValueEntity}
                  onChange={(e) => {
                    setSelectedValueEntity(e.target.value);
                    setError('');
                  }}
                  width="200px"
                  customStyle="font-bold"
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
                {/* <Button btnName="Enregistrer" type="submit" /> */}

                <Button btnName="Enregistrer" type="submit" disabled={isSubmitting} loading={isSubmitting} />

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
              <button
                className='bg-[--blue-conf] text-white border-none p-1 mr-3'
                onClick={confirmDelete}
              >
                Confirmer
              </button>
              <button className='border-[var(--alert-red)] px-2 py-1' onClick={cancelDelete}>
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

export default AddStatusForm;