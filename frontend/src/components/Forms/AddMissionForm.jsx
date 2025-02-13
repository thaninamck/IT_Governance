import React, { useEffect, useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';
import icons from '../../assets/Icons';
import SelectInput from './SelectInput';
import AddClientForm from './AddClientForm';

function AddMissionForm({ title, isOpen, onClose, initialValues, onMissionCreated }) {
  if (!isOpen) return null;

  // États pour la modale d'ajout de client et la liste dynamique des clients
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientOptions, setClientOptions] = useState([
    { label: "Djeezy", value: "Djeezy" },
    { label: "Mobilis", value: "Mobilis" },
    { label: "Oredoo", value: "Oredoo" },
    { label: "Mazars", value: "Mazars" }
  ]);

  // Fonction pour gérer l'ouverture/fermeture de la modale d'ajout de client
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fonction pour ajouter dynamiquement un nouveau client
  const handleClientCreation = (newClient) => {
    setClientOptions((prev) => [...prev, { label: newClient.nom, value: newClient.nom }]);

    closeModal();
  };

  // États pour chaque champ
  const [missionData, setMissionData] = useState(initialValues || {
    client: '',
    mission: '',
    manager: '',
    dateField: '',
    dateField1: '',
    statusMission: 'non_commencee'
  });

  // Réinitialiser le formulaire si les initialValues changent
  useEffect(() => {
    setMissionData(initialValues || {
      client: '',
      mission: '',
      manager: '',
      dateField: '',
      dateField1: '',
      statusMission: 'non_commencee'
    });
  }, [initialValues]);

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    const missionToCreate = {
      ...missionData,
      statusMission: missionData.statusMission || 'non_commencee'
    };
    onMissionCreated(missionToCreate);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <form className="appForm_container" onSubmit={handleSubmit}>
        {/* Icône Close */}
        <button type="button" className="close-button" onClick={onClose}>
          &times;
        </button>

        {/* Titre dynamique */}
        <p>{title}</p>

        {/* Champ : Nom de la mission */}
        <InputForm
          type="text"
          label="Nom de la mission"
          placeholder="Entrez le nom de la mission"
          width="420px"
          flexDirection="flex-col"
          value={missionData.mission}
          onChange={e => setMissionData({ ...missionData, mission: e.target.value })}
        />

        {/* Sélection et ajout de client */}
        <div className="form-row">
          <SelectInput
            label="Client"
            options={clientOptions}
            value={missionData.client}
            onChange={e => setMissionData({ ...missionData, client: e.target.value })}
            width="200px"
            multiSelect={false}
          />
          <button type="button" className="btn_addclient" onClick={openModal}>
            <icons.addCircle sx={{ width: "18px" }} /> Ajouter client
          </button>
        </div>

        {/* Dates */}
        <div className="form-row">
          <InputForm
            type="date"
            label="Date début"
            width="200px"
            flexDirection="flex-col"
            value={missionData.dateField}
            onChange={e => setMissionData({ ...missionData, dateField: e.target.value })}
          />
          <InputForm
            type="date"
            label="Durée"
            width="200px"
            flexDirection="flex-col"
            value={missionData.dateField1}
            onChange={e => setMissionData({ ...missionData, dateField1: e.target.value })}
          />
        </div>

        {/* Manager */}
        <InputForm
          type="text"
          label="Manager"
          placeholder="Nom du manager"
          width="420px"
          flexDirection="flex-col"
          value={missionData.manager}
          onChange={e => setMissionData({ ...missionData, manager: e.target.value })}
        />

        {/* Bouton Créer */}
        <Button btnName="Créer" type="submit" />
      </form>

      {/* Modale d'ajout de client */}
      <AddClientForm
        title="Ajouter un Client"
        isOpen={isModalOpen}
        onClose={closeModal}
        onClientCreated={handleClientCreation}
      />
    </div>
  );
}

export default AddMissionForm;
