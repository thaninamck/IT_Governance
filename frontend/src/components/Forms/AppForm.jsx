import React, { useEffect, useRef, useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';
import SelectInput from './SelectInput';
import MultiOptionSelect from '../Selects/MultiOptionSelect';

function NewAppForm({ title , initialValues = {}, onAddApp,onClose}) {
  const [open, setOpen] = useState(true);
  const isFirstRender = useRef(true); // Pour éviter l'écrasement après la première exécution
  // État pour gérer les erreurs de validation
    const [error, setError] = useState('');

   // États pour chaque champ avec valeurs par défaut
   const [name, setName] = useState(initialValues?.name || '');
   const [description, setDescription] = useState(initialValues?.description || '');
   const [full_name, setFullName] = useState(initialValues?.full_name || '');
   const [email, setEmail] = useState(initialValues?.email || '');
   const[owner_id,setOwnerId]= useState(initialValues?.owner_id || '');
  // const [selectedMulti, setSelectedMulti] = useState(initialValues?.couche || []);
   

   const handleClose = () => {
    onAddApp({}); // Au lieu de null, passez un objet vide
    onClose(); // Notify the parent component that the form is being closed
    setOpen(false);
  };
  
  

 // Mettre à jour les états si initialValues change
// Assurer que les valeurs initiales sont prises en compte uniquement au premier rendu
useEffect(() => {
  if (isFirstRender.current) {
    setName(initialValues.name || '');
    setDescription(initialValues.description || '');
    setFullName(initialValues.full_name || '');
    setEmail(initialValues.email || '');
    setOwnerId(initialValues.owner_id||'');
   // setSelectedMulti(initialValues.couche || []);
    isFirstRender.current = false; // Marquer la première mise à jour comme faite
  }
}, [initialValues]);

const handleSubmit = (e) => {
  e.preventDefault();

  // Vérifier que tous les champs requis sont remplis
  // if (!name|| !description|| !full_name || !email  ) {
  //   setError('Veuillez remplir tous les champs obligatoires.');
  //   return; // Empêcher la soumission
  // }
  const formData = { 
    id: initialValues?.id , // Garde l'ID existant si c'est une mise à jour
    name, 
    description, 
    full_name, 
    email, 
    owner_id,
    //couche: selectedMulti 
  };
  setError(''); // Réinitialiser les erreurs si tout est bon


  onAddApp(formData); 

  setName('');
  setDescription('');
  setFullName('');
  setEmail('');
  setOwnerId('');
 // setSelectedMulti([]);

  //alert(initialValues?.id ? 'Application mise à jour avec succès !' : 'Application créée avec succès !');
};


  
  const options = [
    { label: "Operating System", value:"Operating System" },
    { label: "Application", value: "Application" },
    { label: "Data Base", value: "Data Base" }
  ];

  return (
    open && (
      <form className=" ml-4 pr-4 pl-5  mt-3 relative pb-10    bg-gray-100" onSubmit={handleSubmit}>
        {/* Icône Close */}
        <div className='flex justify-end'>
        <button  className="border-none bg-transparent p-0 text-[25px] font-medium text-gray-800 cursor-pointer hover:text-red-500" type="button" onClick={handleClose}>
          &times;
        </button>
        </div>

        {/* Titre dynamique */}
        <p>{title}</p>
        {error && <span className="text-red-500 text-xs  ">{error}</span>}

        {/* Formulaire */}
        <div className='flex flex-row gap-10'>
        <div>
        <InputForm
          type="text"
          label="Nom de l'application / système"
          placeholder="Entrez le nom de l'application / système"
          width="600px"
          flexDirection="flex-col"
          required={true}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputForm
          type="text"
          label="Description"
          placeholder="Entrez la description"
          width="600px"
         flexDirection="flex-col"
         required={true}
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
          required={true}
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
        />
        <InputForm
          type="email"
          label="Contact"
          placeholder="Entrez l'email du owner"
          width="300px"
         flexDirection="flex-col"
         required={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>
        </div>
        
       
        {/* <SelectInput
        label="Couches"
        options={options}
        value={selectedMulti}
        onChange={(e) => setSelectedMulti(e.target.value)}
        width="200px"
        required={true}
        multiSelect={true}
      /> */}
       {/* <SelectInput
            label={'couche'}
            options={[
              { label: "OS", value: "OS" },
              { label: "APP", value: "APP" },
              { label: "DB", value: "DB" }
            ]}
            value={selectedValue}
            onChange={(e) =>{ setSelectedValue(e.target.value)
              console.log(selectedValue)}
            }
           
            width="200px"
          />*/}

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

export default NewAppForm;