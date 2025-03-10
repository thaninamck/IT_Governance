import React, { useEffect, useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function AddClientForm({ title, isOpen, onClose, initialValues, onClientCreated }) {
  if (!isOpen) return null;
  const [loading, setLoading] = useState(false);
  // État pour gérer les erreurs de validation
  const [error, setError] = useState('');

  // États pour chaque champ
  const [clientData, setClientData] = useState(initialValues || {
    commercial_name: '',
    social_reason: '',
    correspondence: '',
    address: '',
    contact_1: '',
    contact_2: '',
  });

  useEffect(() => {

    setClientData(initialValues || {
      commercial_name: '',
      social_reason: '',
      correspondence: '',
      address: '',
      contact_1: '',
      contact_2: '',
    });
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêcher le rechargement
    if (!clientData.commercial_name|| !clientData.social_reason || !clientData.correspondence || !clientData.address || !clientData.contact_1) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return; // Empêcher la soumission
    }
    setError(''); // Réinitialiser les erreurs si tout est bon

    console.log(clientData)
    onClientCreated(clientData);
    console.log('after', clientData)
    setLoading(false);
    onClose();
    setError(''); // Réinitialiser les erreurs si tout est bon


  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <form className="appForm_container" onSubmit={handleSubmit}>
        {/* Icône Close */}
        <button className="close-button" type="button" onClick={onClose}>
          &times;
        </button>

        {/* Titre dynamique */}
        <p>{title}</p>
        {error && <span className="text-red-500 text-xs  ">{error}</span>}


        {/* Formulaire */}
        <InputForm
          type="text"
          label="Nom du client"
          placeholder="Entrez le nom du client"
          width="420px"
          flexDirection="flex-col"
          required={true}
          value={clientData.commercial_name}
          onChange={e => setClientData({ ...clientData, commercial_name: e.target.value })}
        />
        <div className="form-row">
          <InputForm
            type="text"
            label="Raison Sociale"
            placeholder="Raison sociale"
            width="200px"
            flexDirection="flex-col"
            required={true}
            value={clientData.social_reason}
            onChange={e => setClientData({ ...clientData, social_reason: e.target.value })}
          />
          <InputForm
            type="text"
            label="Secteur"
            placeholder="Secteur"
            width="200px"
            flexDirection="flex-col"
            required={true}
            value={clientData.correspondence}
            onChange={e => setClientData({ ...clientData, correspondence: e.target.value })}
          />
        </div>
        <InputForm
          type="text"
          label="E-mail"
          placeholder="Entrez l'e-mail du client"
          width="420px"
          required={true}
          flexDirection="flex-col"
          value={clientData.address}
          onChange={e => setClientData({ ...clientData, address: e.target.value })}
        />
        <div className="form-row">
          <InputForm
            type="text"
            label="Contact 1"
            placeholder="Numéro de téléphone"
            width="200px"
            required={true}
            flexDirection="flex-col"
            value={clientData.contact_1}
            onChange={e => setClientData({ ...clientData, contact_1: e.target.value })}
          />
          <InputForm
            type="text"
            label="Contact 2"
            placeholder="Numéro de téléphone"
            width="200px"

            flexDirection="flex-col"
            value={clientData.contact_2}
            onChange={e => setClientData({ ...clientData, contact_2: e.target.value })}
          />
        </div>

        {/* Bouton Créer */}
        <Button btnName={loading ? " Création en cours..." : "Créer"} type="submit" disabled={loading} />
      </form>
    </div>

  );
}

export default AddClientForm;
