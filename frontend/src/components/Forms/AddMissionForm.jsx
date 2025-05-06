import React, { useEffect, useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';
import icons from '../../assets/Icons';
import SelectInput from './SelectInput';
import AddClientForm from './AddClientForm';
import useClient from '../../Hooks/useClient';
import useUser from '../../Hooks/useUser';

function AddMissionForm({ title, isOpen, onClose, initialValues, onMissionCreated }) {
  if (!isOpen) return null;

  // États pour la modale d'ajout de client et la liste dynamique des clients
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Utilisez le hook useClient pour accéder à fetchClients et filteredRows
  const { filtereRows, fetchClients ,handleClientCreation} = useClient();

   // Utilisez le hook useUser pour accéder à fetchUseret filteredRows
   const { filteredRows, fetchUsers } = useUser();

  // // Fonction pour transformer les clients en options pour le SelectInput
  // useEffect(() => {
  //   if (filteredRows.length > 0) {
  //     const options = filteredRows.map(client => ({
  //       label: client.commercialName, // Utilisez le champ approprié pour le label
  //       value: client.id, // Utilisez le champ approprié pour la valeur
  //     }));
  //     setClientOptions(options);
  //   }
  // }, [filteredRows]);

  // // Appeler fetchClients au montage du composant
  // useEffect(() => {
  //   fetchClients();
  // }, [fetchClients]);

  // const [clientOptions, setClientOptions] = useState([]);

  // Transformer les clients en options pour le SelectInput
  const [clientOptions, setClientOptions] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    setClientOptions(
      filtereRows.map(client => ({
        label: client.commercialName, // Assurez-vous d'utiliser le bon champ ici
        value: client.id,
      }))
    );
  }, [filtereRows]);
  const [UserOptions, setUserOptions] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setUserOptions(
      filteredRows.map(user=> ({
        label: user.fullName, // Assurez-vous d'utiliser le bon champ ici
        value: user.id,
      }))
    );
  }, [filteredRows]);

  // Fonction pour gérer l'ouverture/fermeture de la modale d'ajout de client
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // // Fonction pour ajouter dynamiquement un nouveau client
  // const handleClientCreation = (newClient) => {
  //   setClientOptions((prev) => [...prev, { label: newClient.nom, value: newClient.id }]);
  //   closeModal();
  // };

  // États pour chaque champ
  const [missionData, setMissionData] = useState(initialValues || {
    client_id: '',
    client_name: '', // Add client_name
    mission_name: '',
    manager_id: '',
    manager_name: '', // Add manager_name
    start_date: '',
    end_date: '',
    audit_start_date: '',
    audit_end_date: '',
  });

  // État pour gérer les erreurs de validation
  const [error, setError] = useState('');

  // Réinitialiser le formulaire si les initialValues changent
  // useEffect(() => {
  //   setMissionData(initialValues || {
  //     client_id: '',
  //     mission_name: '',
  //     manager_id: '',
  //     start_date: '',
  //     end_date: '',
  //     audit_start_date: '',
  //     audit_end_date: '',
  //   });
  // }, [initialValues]);
  useEffect(() => {
    if (initialValues) {
      setMissionData({
        id:initialValues.id,
        client_id: initialValues.client_id,
        client_name: initialValues.client_name,
        mission_name: initialValues.mission_name,
        manager_id: initialValues.manager_id,
        manager_name: initialValues.manager_name,
        start_date: initialValues.start_date,
        end_date: initialValues.end_date,
        audit_start_date: initialValues.audit_start_date,
        audit_end_date: initialValues.audit_end_date,
      });
    }
  }, [initialValues]);

  // Fonction pour valider les dates
  const validateDates = (startDate, endDate, maxDate = null) => {
    if (new Date(startDate) > new Date(endDate)) {
      setError('La date de fin doit être postérieure ou égale à la date de début.');
      return false;
    }
    if (maxDate && new Date(endDate) >= new Date(maxDate)) {
      setError('La période auditée doit être antérieure à la durée de la mission.');
      return false;
    }
    setError('');
    return true;
  };

  // Fonction pour valider la date de début
  const validateStartDate = (startDate) => {
    const currentDate = new Date().toISOString().split("T")[0];
    if (new Date(startDate) < new Date(currentDate)) {
      setError("La date de début ne peut pas être dans le passé.");
      return false;
    }
    return true;
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérifier que tous les champs requis sont remplis
    if (
      !missionData.mission_name ||
      !missionData.client_id ||
      !missionData.manager_id ||
      !missionData.start_date ||
      !missionData.end_date ||
      !missionData.audit_start_date ||
      !missionData.audit_end_date
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

     // Si c'est une création (pas de initialValues), vérifier la date de début
  if (!initialValues && !validateStartDate(missionData.start_date)) {
    return;
  }
     

    // Vérifier la validité des dates d'audit
    if (!validateDates(missionData.audit_start_date, missionData.audit_end_date)) return;

    // Vérifier que start_date est après audit_end_date
    if (new Date(missionData.start_date) <= new Date(missionData.audit_end_date)) {
      setError('La date de début de la mission doit être après la fin de l\'audit.');
      return;
    }

    // Vérifier que end_date est après start_date
    if (!validateDates(missionData.start_date, missionData.end_date)) return;

    setError(""); // Réinitialiser les erreurs si tout est bon

    // Envoyer les données au parent pour création
    onMissionCreated(missionData);
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
        {error && <span className="text-red-500 text-xs">{error}</span>}

        {/* Champ : Nom de la mission */}
        <InputForm
          type="text"
          label="Nom de la mission"
          placeholder="Entrez le nom de la mission"
          width="420px"
          flexDirection="flex-col"
          required={true}
          value={missionData.mission_name}
          onChange={e => setMissionData({ ...missionData, mission_name: e.target.value })}
        />

        {/* Sélection et ajout de client */}
        <div className="form-row">
          <SelectInput
            label="Client"
            options={clientOptions}
            value={missionData.client_id}
            onChange={e => setMissionData({ ...missionData, client_id: e.target.value })}
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
            value={missionData.start_date}
            onChange={e => setMissionData({ ...missionData, start_date: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
          />
          <InputForm
            type="date"
            label="Date fin"
            width="200px"
            flexDirection="flex-col"
            required={true}
            value={missionData.end_date}
            onChange={e => setMissionData({ ...missionData, end_date: e.target.value })}
            min={missionData.start_date}
          />
        </div>

        {/* Période auditée */}
        <div className="">
          <div className="flex items-center gap-2">
            <label className="text-sm mb-2 ml-1">Période auditée</label>
            <span className="text-[var(--alert-red)]">*</span>
          </div>
          <div className="flex flex-row items-center justify-between gap-4 mt-1 pl-2 border border-gray-300 rounded-lg">
            <span className="text-sm">De</span>
            <input
              required
              type="date"
              className="py-1 px-3 placeholder:text-xs text-gray-500"
              placeholder="JJ/MM/AAAA"
              value={missionData.audit_start_date}
              onChange={e => setMissionData({ ...missionData, audit_start_date: e.target.value })}
              max={missionData.start_date}
            />
            <span className="text-sm">à</span>
            <input
              required
              type="date"
              className="py-2 px-2 placeholder:text-xs text-gray-500"
              placeholder="JJ/MM/AAAA"
              value={missionData.audit_end_date}
              onChange={e => setMissionData({ ...missionData, audit_end_date: e.target.value })}
              min={missionData.audit_start_date}
              max={missionData.start_date}
            />
          </div>
        </div>

           {/* Manager */}
        {/* <InputForm
  type="number"
  label="Manager"
  placeholder="Nom du manager"
  width="420px"
  flexDirection="flex-col"
  required={true}
  value={missionData.manager_id}
  onChange={e => setMissionData({ ...missionData, manager_id: parseInt(e.target.value) || 0 })}
/> */}

<SelectInput
            label="Manager"
            options={UserOptions}
            value={missionData.manager_id}
            onChange={e => setMissionData({ ...missionData, manager_id: e.target.value })}
            width="420px"
            multiSelect={false}
            required={true}
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