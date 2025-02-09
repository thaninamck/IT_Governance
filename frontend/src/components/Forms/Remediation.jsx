import React, { useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function Remediation({ title }) {
  const [open, setOpen] = useState(true);
  
  // États pour chaque champ
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      description,
      email,
    };
    console.log('Form Data:', formData);
    alert('Remédiation envoyée avec succès !');
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
          label="Description de la remédiation"
          placeholder="Entrez la description de la remédiation..."
          width="600px"
         flexDirection="flex-col"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <InputForm
          type="email"
          label="E-mail"
          placeholder="Entrez l'e-mail de la personne concernée..."
          width="600px"
         flexDirection="flex-col"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Bouton Envoyer */}
        <Button btnName="Envoyer" type="submit" />
      </form>
    )
  );
}

export default Remediation;
