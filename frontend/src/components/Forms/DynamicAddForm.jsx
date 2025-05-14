import React from 'react';
import InputForm from './InputForm';
import AddButton from '../AddButton';
import SelectInput from './SelectInput';
import { Snackbar, Alert } from '@mui/material';
import Button from '../Button';
import useSettings from '../../Hooks/useSettings';

function DynamicAddForm({ title, label, placeholder, onAdd, fetchEndpoint, createEndpoint, deleteEndpoint, labelKey = 'name', itemKey }) {
  const {
    selectedValue,
    setSelectedValue,
    inputValue,
    setInputValue,
    showForm,
    setShowForm,
    error,
    items,
    deleteConfirmationOpen,
    handleSubmit,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
  } = useSettings({
    fetchEndpoint,
    createEndpoint,
    deleteEndpoint,
    labelKey,
    itemKey,
    onAdd,
  });

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
            <div className='flex flex-col h-[110px] w-[400px]'>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <form className="flex flex-row items-end justify-between" onSubmit={handleSubmit}>
                <InputForm
                  type="text"
                  label={label}
                  placeholder={placeholder}
                  width="200px"
                  flexDirection="flex-col"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    
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

export default DynamicAddForm;