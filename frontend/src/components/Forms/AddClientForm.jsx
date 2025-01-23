import React, { useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function AddClientForm({ title }) {
  const [open, setOpen] = useState(true);

  // États pour chaque champ
  const [clientName, setClientName] = useState('');
  const [raisonSocial, setRaisonSocial] = useState('');
  const [sector, setSector] = useState('');
  const [email, setEmail] = useState('');
  const [contact1, setContact1] = useState('');
  const [contact2, setContact2] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      clientName,
      raisonSocial,
      sector,
      email,
      contact1,
      contact2,
    };
    console.log('Form Data:', formData);
    alert('Client ajouté avec succès !');
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
          label="Nom du client"
          placeholder="Entrez le nom du client"
          width="420px"
          flexDirection="column"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <div className="form-row">
          <InputForm
            type="text"
            label="Raison Sociale"
            placeholder="Raison sociale"
            width="200px"
            flexDirection="column"
            value={raisonSocial}
            onChange={(e) => setRaisonSocial(e.target.value)}
          />
          <InputForm
            type="text"
            label="Secteur"
            placeholder="Secteur"
            width="200px"
            flexDirection="column"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          />
        </div>
        <InputForm
          type="email"
          label="E-mail"
          placeholder="Entrez l'e-mail du client"
          width="420px"
          flexDirection="column"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="form-row">
          <InputForm
            type="text"
            label="Contact 1"
            placeholder="Numéro de téléphone"
            width="200px"
            flexDirection="column"
            value={contact1}
            onChange={(e) => setContact1(e.target.value)}
          />
          <InputForm
            type="text"
            label="Contact 2"
            placeholder="Numéro de téléphone"
            width="200px"
            flexDirection="column"
            value={contact2}
            onChange={(e) => setContact2(e.target.value)}
          />
        </div>

        {/* Bouton Créer */}
        <Button btnName="Créer" type="submit" />
      </form>
    )
  );
}

export default AddClientForm;
