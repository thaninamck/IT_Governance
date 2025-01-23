import React, { useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function NewAppForm({ title }) {
  const [open, setOpen] = useState(true);

  // États pour chaque champ
  const [nomApp, setNomApp] = useState('');
  const [description, setDescription] = useState('');
  const [couche, setCouche] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      nomApp,
      description,
      couche,
    };
    console.log('Form Data:', formData);
    alert('Application créée avec succès !');
    // Vous pouvez envoyer les données via une API ici
  };

  return (
    open && (
      <form className="appForm_container" onSubmit={handleSubmit}>
        {/* Icône Close */}
        <button className="close-button" type="button" onClick={handleClose}>
          &times;
        </button>

        {/* Titre dynamique */}
        <p>{title}</p>

        {/* Formulaire */}
        <InputForm
          type="text"
          label="Nom de l'application / système"
          placeholder="Entrez le nom de l'application / système"
          width="600px"
          flexDirection="column"
          value={nomApp}
          onChange={(e) => setNomApp(e.target.value)}
        />
        <InputForm
          type="text"
          label="Description"
          placeholder="Entrez la description"
          width="600px"
          flexDirection="column"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <InputForm
          type="text"
          label="Couche"
          placeholder="couche"
          width="200px"
          flexDirection="column"
          value={couche}
          onChange={(e) => setCouche(e.target.value)}
        />

        {/* Bouton Créer */}
        <Button btnName="Créer" type="submit" />
      </form>
    )
  );
}

export default NewAppForm;
