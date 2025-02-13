import React, { useEffect, useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';
import icons from '../../assets/Icons';

function AddMissionForm({ title ,isOpen, onClose,initialValues, onMissionCreated  }) {
  if (!isOpen) return null; // Ne pas afficher le modal si isOpen est false


  // États pour chaque champ
  const [missionData, setMissionData] = useState(initialValues || {
    client: '',
    mission: '',
    manager: [],
    dateField: '',
    dateField1: '',
    statusMission: ''
});

useEffect(() => {
  
    setMissionData(initialValues || {
        client: '',
        mission: '',
        manager: [],
        dateField: '',
        dateField1: '',
        statusMission: ''
    });
}, [initialValues]);

const handleSubmit = (e) => {
  e.preventDefault(); // Empêcher le rechargement
  onMissionCreated(missionData);
  onClose();
};

  return (
    <div  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <form className="appForm_container" onSubmit={handleSubmit}>
        {/* Icône Close */}
        <button className="close-button" onClick={onClose}>
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
         flexDirection="flex-col"
          value={missionData.mission}
          onChange={e => setMissionData({...missionData, mission: e.target.value})}
        />
        <div className="form-row">
          <InputForm
            type="text"
            label="Client"
            placeholder="Raison sociale"
            width="200px"
           flexDirection="flex-col"
            value={missionData.client}
            onChange={e => setMissionData({...missionData, client: e.target.value})}
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
           flexDirection="flex-col"
            value={missionData.dateField}
            onChange={e => setMissionData({...missionData, dateField: e.target.value})}
          />
          <InputForm
            type="date"
            label="Durée"
            placeholder="20 jours"
            width="200px"
         flexDirection="flex-col"
            value={missionData.dateField1}
            onChange={e => setMissionData({...missionData, dateField1: e.target.value})}
          />
        </div>
       {/* <InputForm
          type="text"
          label="Période audité"
          placeholder="6 mois"
          width="420px"
          flexDirection={"column"}
          value={auditedPeriod}
          onChange={(e) => setAuditedPeriod(e.target.value)}
        />*/}
        <select value={missionData.statusMission} onChange={e => setMissionData({...missionData, statusMission: e.target.value})}>
                    <option value="en_cours">En cours</option>
                    <option value="terminee">Terminée</option>
                    <option value="non_commencee">Non commencée</option>
                    <option value="en_retard">En retard</option>
                </select>
        <InputForm
          type="text"
          label="Manager"
          placeholder="Nom du manager"
          width="420px"
         flexDirection="flex-col"
          value={missionData.manager}
          onChange={e => setMissionData({...missionData, manager: e.target.value})}
        />

        {/* Bouton Créer */}
        <Button btnName="Créer" type="submit" />
      </form>
      </div>
    
  );
}

export default AddMissionForm;
