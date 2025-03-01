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
    auditStartDate:'',
    auditEndDate:'',
    statusMission: 'non_commencee'
  });

  // État pour gérer les erreurs de validation
  const [error, setError] = useState('');

  // Réinitialiser le formulaire si les initialValues changent
  useEffect(() => {
    setMissionData(initialValues || {
      client: '',
      mission: '',
      manager: '',
      dateField: '',
      dateField1: '',
      auditStartDate:'',
    auditEndDate:'',
      statusMission: 'non_commencee'
    });
  }, [initialValues]);

  // Fonction pour valider les dates
  const validateDates = (startDate, endDate,maxDate=null) => {
    if (new Date(startDate) > new Date(endDate)) {
      setError('La date de fin doit être postérieure ou égale à la date de début.');
      return false;
    }
    if (maxDate && new Date(endDate) >= new Date(maxDate)) {
      setError('La période auditée doit être antérieure à la durée de la mission.');
      return false;
    }

    setError(''); // Réinitialiser l'erreur si les dates sont valides
    return true;
  };


  const validateStartDate = (startDate) => {
    const currentDate = new Date().toISOString().split("T")[0]; // Date actuelle au format YYYY-MM-DD
    if (new Date(startDate) < new Date(currentDate)) {
      setError("La date de début ne peut pas être dans le passé.");
      return false;
    }
    return true;
  };

  // Fonction pour gérer le changement de la date de fin
  const handleDateField1Change = (e) => {
    const selectedDate = e.target.value;

    // Vérifier si la date sélectionnée est antérieure à la date de début
    if (new Date(selectedDate) < new Date(missionData.dateField)) {
      setError('La date de fin doit être postérieure ou égale à la date de début.');
      setMissionData((prev) => ({ ...prev, dateField1: '' })); // Réinitialiser la date de fin si elle est invalide
    } else {
      setError('');
      setMissionData((prev) => ({ ...prev, dateField1: selectedDate }));
    }
  };

  const handleAuditEndDateChange = (e) => {
    const selectedDate = e.target.value;
     // Vérifier si la date sélectionnée est antérieure à la date de début
     if (new Date(selectedDate) < new Date(missionData.auditStartDate)) {
      setError('La date de fin doit être postérieure ou égale à la date de début.');
      setMissionData((prev) => ({ ...prev, auditEndDate: '' })); // Réinitialiser la date de fin si elle est invalide
    } else {
      setError('');
      setMissionData((prev) => ({ ...prev, auditEndDate: selectedDate }));
    }
  };
  
  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Vérifier que tous les champs requis sont remplis
    if (
      !missionData.mission ||
      !missionData.client ||
      !missionData.manager ||
      !missionData.dateField ||
      !missionData.dateField1 ||
      !missionData.auditStartDate ||
      !missionData.auditEndDate
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return; // Empêcher la soumission
    }
  
    // Vérifier si la date de début est dans le passé
    if (!validateStartDate(missionData.dateField)) {
      return; // Empêcher la soumission si la date de début est dans le passé
    }
  
    // Vérifier la validité des dates de mission
    if (!validateDates(missionData.dateField, missionData.dateField1)) {
      return;
    }
  
    // Vérifier la validité des dates d’audit (et qu’elles sont avant la date de fin de mission)
    if (!validateDates(missionData.auditStartDate, missionData.auditEndDate, missionData.dateField)) {
      return;
    }
  
    setError(""); // Réinitialiser les erreurs si tout est bon
  
    const missionToCreate = {
      ...missionData,
      statusMission: missionData.statusMission || "non_commencee",
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
         {/* Afficher l'erreur si les dates ne sont pas valides */}
         {error && <span className="text-red-500 text-xs  ">{error}</span>}

        {/* Champ : Nom de la mission */}
        <InputForm
          type="text"
          label="Nom de la mission"
          placeholder="Entrez le nom de la mission"
          width="420px"
          flexDirection="flex-col"
          required={true}
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
            required={true}

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
            required={true}
            value={missionData.dateField}
            onChange={e => setMissionData({ ...missionData, dateField: e.target.value })}
            min={new Date().toISOString().split("T")[0]} // Bloquer les dates passées
          />
          <InputForm
          
            type="date"
            label="Durée"
            width="200px"
            flexDirection="flex-col"
            required={true}
            value={missionData.dateField1}
           
           onChange={handleDateField1Change} Utiliser la nouvelle fonction de gestion
            min={missionData.dateField} // L'attribut min est défini sur la date de début
          />
        </div>

 {/* Période auditée */}
        
 <div className=''> 
 <div className='flex items-center gap-2'>
          <lable className='text-sm mb-2 ml-1 '>Période auditée</lable>
          <span className="text-[var(--alert-red)]">*</span>
      </div>
          <div className='flex flex-row items-center justify-between gap-4 mt-1  pl-2  border border-gray-300 rounded-lg '>
          <span className='text-sm  '>De</span>
          <input
          required
          type='date'
          className=' py-1 px-3  placeholder:text-xs text-gray-500'
           placeholder="JJ/MM/AAAA"
           value={missionData.auditStartDate}
           onChange={e => setMissionData({ ...missionData, auditStartDate: e.target.value })}
             max={missionData.dateField} // Empêche la sélection d'une date supérieure à la fin de mission
          />
          <span className='text-sm '>à</span>
          <input
          required
          type='date'
          className=' py-2 px-2  placeholder:text-xs text-gray-500 '
           placeholder="JJ/MM/AAAA"
           value={missionData.auditEndDate}
           onChange={e => setMissionData({ ...missionData, auditEndDate: e.target.value })}
           min={missionData.auditStartDate} // L'attribut min est défini sur la date de début
           max={missionData.dateField} // Empêche la sélection d'une date supérieure à la fin de mission
          />

          </div>
         

        </div>

       
       
        {/* Manager */}
        <InputForm
          type="text"
          label="Manager"
          placeholder="Nom du manager"
          width="420px"
          flexDirection="flex-col"
          required={true}
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