import React, { useEffect, useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function AddClientForm({ title ,isOpen, onClose,initialValues, onClientCreated  }) {
  if (!isOpen) return null;

 // États pour chaque champ
 const [clientData, setClientData] = useState(initialValues || {
  nom: '',
  raisonSocial: '',
  secteur: '',
  email: '',
  contact1: '',
  contact2: '',
});

  useEffect(() => {
    
      setClientData(initialValues || {
        nom:'',
        raisonSocial:'',
        secteur:'',
        email:'',
        contact1:'',
        contact2:'',
      });
  }, [initialValues]);

   const handleSubmit = (e) => {
     e.preventDefault(); // Empêcher le rechargement
     console.log(clientData)
     onClientCreated(clientData);
     console.log('after',clientData)
     onClose();
     
   };
  
    
  return (
    <div  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <form className="appForm_container" onSubmit={handleSubmit}>
        {/* Icône Close */}
        <button className="close-button" type="button" onClick={onClose}>
          &times;
        </button>

        {/* Titre dynamique */}
        <p>{title}</p>

        {/* Formulaire */}
        <InputForm
          type="text"
          label="Nom du client"
          placeholder="Entrez le nom du client"
          width="420px"
          flexDirection="flex-col"
          value={clientData.nom}
          onChange={e => setClientData({...clientData, nom: e.target.value})}
        />
        <div className="form-row">
          <InputForm
            type="text"
            label="Raison Sociale"
            placeholder="Raison sociale"
            width="200px"
            flexDirection="flex-col"
            value={clientData.raisonSocial}
          onChange={e => setClientData({...clientData, raisonSocial: e.target.value})}
          />
          <InputForm
            type="text"
            label="Secteur"
            placeholder="Secteur"
            width="200px"
           flexDirection="flex-col"
            value={clientData.secteur}
          onChange={e => setClientData({...clientData, secteur: e.target.value})}
          />
        </div>
        <InputForm
          type="email"
          label="E-mail"
          placeholder="Entrez l'e-mail du client"
          width="420px"
        flexDirection="flex-col"
          value={clientData.email}
          onChange={e => setClientData({...clientData, email: e.target.value})}
        />
        <div className="form-row">
          <InputForm
            type="text"
            label="Contact 1"
            placeholder="Numéro de téléphone"
            width="200px"
            flexDirection="flex-col"
            value={clientData.contact1}
          onChange={e => setClientData({...clientData, contact1: e.target.value})}
          />
          <InputForm
            type="text"
            label="Contact 2"
            placeholder="Numéro de téléphone"
            width="200px"
           flexDirection="flex-col"
            value={clientData.contact2}
          onChange={e => setClientData({...clientData, contact2: e.target.value})}
          />
        </div>

        {/* Bouton Créer */}
        <Button btnName="Créer" type="submit" />
      </form>
      </div>
    
  );
}

export default AddClientForm;
