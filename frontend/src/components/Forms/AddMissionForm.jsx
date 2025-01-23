import React, { useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';
import icons from '../../assets/Icons';

function AddMissionForm({ title }) {
  const [open, setOpen] = useState(true);

  // États pour chaque champ
  const [missionName, setMissionName] = useState('');
  const [client, setClient] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [auditedPeriod, setAuditedPeriod] = useState('');
  const [manager, setManager] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      missionName,
      client,
      startDate,
      duration,
      auditedPeriod,
      manager,
    };
    console.log('Form Data:', formData);
    alert('Formulaire soumis avec succès !');
    // Vous pouvez ici envoyer les données à une API ou les traiter
  };

  return (
    open && (
      <form className="appForm_container" onSubmit={handleSubmit}>
        {/* Icône Close */}
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>

        {/* Titre dynamique */}
        <p>{title}</p>

        {/* Formulaire */}
        <InputForm
          type="text"
          label="Nom de la mission"
          placeholder="Entrez le nom de la mission"
          width="420px"
          flexDirection={"column"}
          value={missionName}
          onChange={(e) => setMissionName(e.target.value)}
        />
        <div className="form-row">
          <InputForm
            type="text"
            label="Client"
            placeholder="Raison sociale"
            width="200px"
            flexDirection={"column"}
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
          <button className="btn_addclient">
            <icons.addCircle sx={{ width: "18px" }} /> Ajouter client
          </button>
        </div>
        <div className="form-row">
          <InputForm
            type="date"
            label="Date début"
            placeholder=""
            width="200px"
            flexDirection={"column"}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <InputForm
            type="text"
            label="Durée"
            placeholder="20 jours"
            width="200px"
            flexDirection={"column"}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <InputForm
          type="text"
          label="Période audité"
          placeholder="6 mois"
          width="420px"
          flexDirection={"column"}
          value={auditedPeriod}
          onChange={(e) => setAuditedPeriod(e.target.value)}
        />
        <InputForm
          type="text"
          label="Manager"
          placeholder="Nom du manager"
          width="420px"
          flexDirection={"column"}
          value={manager}
          onChange={(e) => setManager(e.target.value)}
        />

        {/* Bouton Créer */}
        <Button btnName="Créer" type="submit" />
      </form>
    )
  );
}

export default AddMissionForm;
