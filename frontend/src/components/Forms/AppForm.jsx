import React, { useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';
import SelectInput from './SelectInput';

function NewAppForm({ title ,onAddApp}) {
  const [open, setOpen] = useState(true);

  // États pour chaque champ
   // États pour chaque champ
   const [nomApp, setNomApp] = useState('');
   const [description, setDescription] = useState('');
   const [owner, setOwner] = useState('');
   const [contact, setContact] = useState('');
   const [selectedValue, setSelectedValue] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      nomApp,
      description,
      owner,
      contact,
      couche: selectedValue,
    };
    onAddApp(formData); // Ajouter l'application au tableau parent
    setNomApp('');
    setDescription('');
    setOwner('');
    setContact('');
    setSelectedValue('');
    alert('Application créée avec succès !');
  };

  return (
    open && (
      <form className=" ml-4 pr-2 pl-2 relative pb-10 " onSubmit={handleSubmit}>
        {/* Icône Close */}
        <div className='flex justify-end'>
        <button  className="border-none bg-transparent p-0 text-[25px] font-medium text-gray-800 cursor-pointer hover:text-red-500" type="button" onClick={handleClose}>
          &times;
        </button>
        </div>

        {/* Titre dynamique */}
        <p>{title}</p>

        {/* Formulaire */}
        <div className='flex flex-row gap-10'>
        <div>
        <InputForm
          type="text"
          label="Nom de l'application / système"
          placeholder="Entrez le nom de l'application / système"
          width="600px"
          flexDirection="flex-col"
          value={nomApp}
          onChange={(e) => setNomApp(e.target.value)}
        />
        <InputForm
          type="text"
          label="Description"
          placeholder="Entrez la description"
          width="600px"
         flexDirection="flex-col"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        </div>
        <div>
        <InputForm
          type="text"
          label="Owner"
          placeholder="Entrez le nom de l'application / système"
          width="300px"
          flexDirection="flex-col"
          value={nomApp}
          onChange={(e) => setNomApp(e.target.value)}
        />
        <InputForm
          type="email"
          label="Contact"
          placeholder="Entrez l'email du owner"
          width="300px"
         flexDirection="flex-col"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        </div>
        </div>
        
        <SelectInput
            label={'couche'}
            options={[
              { label: "OS", value: "1" },
              { label: "APP", value: "2" },
              { label: "DB", value: "3" }
            ]}
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            width="200px"
          />

<div className="absolute bottom-2 right-2">
    <button
      className="px-4 py-2 bg-[var(--blue-menu)] text-white rounded hover:bg-blue-700"
      type="submit"
    >
      Créer
    </button>
  </div>
       
      </form>
    )
  );
}

export default NewAppForm;
