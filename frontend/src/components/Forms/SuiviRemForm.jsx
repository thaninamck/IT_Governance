import React, { useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function SuiviRemForm({ title }) {
  const [open, setOpen] = useState(true);
  
  // États pour chaque champ
  const [dateCreation, setDateCreation] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [suivi, setSuivi] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      dateCreation,
      description,
      email,
      suivi,
    };
    console.log('Form Data:', formData);
    alert('Suivi de la remédiation enregistré avec succès !');
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
          type="date"
          label="Date création "
          placeholder=""
          width="200px"
          flexDirection="column"
          value={dateCreation}
          onChange={(e) => setDateCreation(e.target.value)}
        />
        <InputForm
          type="text"
          label="Description de la remédiation"
          placeholder="Entrez la description de la remédiation..."
          width="600px"
          flexDirection="column"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <InputForm
          type="email"
          label="E-mail"
          placeholder="Entrez l'e-mail de la personne concernée..."
          width="600px"
          flexDirection="column"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputForm
          type="text"
          label="Suivi"
          placeholder="Text ..."
          width="600px"
          flexDirection="column"
          value={suivi}
          onChange={(e) => setSuivi(e.target.value)}
        />

        {/* Bouton Enregistrer */}
        <Button btnName="Enregistrer" type="submit" />
      </form>
    )
  );
}

export default SuiviRemForm;