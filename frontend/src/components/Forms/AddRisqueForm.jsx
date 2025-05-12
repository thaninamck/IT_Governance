import React, { useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function AddRisqueForm({ title, isOpen, onClose, initialValues, onRisqueCreated }) {
  if (!isOpen) return null; // Ne pas afficher le modal si isOpen est false

   // État pour gérer les erreurs de validation
    const [error, setError] = useState('');

  // États pour chaque champ
  const [risqueData, setRisqueData] = useState({
    code: '',
    nom: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêcher le rechargement
    
    if (!risqueData.code || !risqueData.nom|| !risqueData.description ) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return; // Empêcher la soumission
    }
    setError(''); // Réinitialiser les erreurs si tout est bon
const risqueDataToSend = {
      code: risqueData.code,
      name: risqueData.nom,
      description: risqueData.description,
    };
    onRisqueCreated(risqueDataToSend); // Met à jour avant d'envoyer
    onClose(); // Ferme le formulaire après soumission
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
        <div className="form-row">
          <InputForm
            type="text"
            label="Code du risque"
            placeholder="code"
            width="150px"
            flexDirection="flex-col"
            required={true}
            value={risqueData.code}
            onChange={(e) => setRisqueData({ ...risqueData, code: e.target.value })}
          />
          <InputForm
            type="text"
            label="Nom du risque"
            placeholder="nom"
            width="450px"
            flexDirection="flex-col"
            required={true}
            value={risqueData.name}
            onChange={(e) => setRisqueData({ ...risqueData, nom: e.target.value })}
          />
        </div>
        <div className="form-row">
          <InputForm
            type="text"
            label="Description"
            placeholder="Description du risque"
            width="630px"
            flexDirection="flex-col"
            required={true}
            value={risqueData.description}
            onChange={(e) => setRisqueData({ ...risqueData, description: e.target.value })}
          />
        </div>

        {/* Bouton Créer */}
        {/* <Button btnName="Créer" type="submit" /> */}
        <div className="flex justify-center mt-4 mb-2">
  <button
    type="submit"
    className="bg-[var(--blue-menu)] border-none hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
    disabled={loading}
  >
    {initialValues?.id
      ? (loading ? "Mise à jour en cours..." : "Mettre à jour")
      : (loading ? "Création en cours..." : "Créer")}
  </button>
</div>

      </form>
    </div>
  );
}

export default AddRisqueForm;
