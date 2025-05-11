import { useState, useEffect } from 'react';
import { api } from '../Api';
import { useBreadcrumb } from '../Context/BreadcrumbContext';


export const useSystem = (missionId, user, showForm, onToggleForm,missionName) => {
 
  const [applications, setApplications] = useState([]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDecisionPopup, setShowDecisionPopup] = useState(false);
  const [isAddingAnother, setIsAddingAnother] = useState(false);

  // Récupérer les systèmes de la mission
  const fetchMissionSystems = async () => {
    try {
      const response = await api.get(`/mission/${missionId}/getsystems`);
      setApplications(response.data.original.systems);
    } catch (error) {
      console.error("Erreur lors de la récupération des systems:", error);
    } 
  };
  
  useEffect(() => {
    if (missionId) {
      fetchMissionSystems();
    }
  }, [missionId]);
  

  const handleAddApp = async (app) => {
    try {
      if (selectedApp) {
         // Mise à jour de l'application existante
        const response = await api.put(`/updatesystemId/${app.id}`, app);
        setApplications(prevApps => 
          prevApps.map(row => row.id === app.id ? response.data : row)
        );
        setSelectedApp(null);
        onToggleForm();
      } else {
        console.log('add  app',app)
          // Ajout d'une nouvelle application
        const response = await api.post(`/mission/${missionId}/createsystem`, app);
        console.log('Nouvelle app créée:', response.data);
        setApplications(prev => [...prev, response.data]);
        await fetchMissionSystems();
        console.log(response.data)
        setShowDecisionPopup(true);
       
      }
    } catch (error) {
      console.error("Erreur lors de la création/mise à jour d'une application:", error);
      throw error;
    }
  };

  const handleDeleteRow = (selectedRow) => {
    setSelectedAppId(selectedRow.id);
    setIsDeletePopupOpen(true);
  };

  const confirmDeleteMission = async () => {
    try {
      if (selectedAppId !== null) {
        await api.delete(`/deletesystemId/${selectedAppId}`);
        setApplications(prev => prev.filter(row => row.id !== selectedAppId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du systeme:", error);
      
    } 
      setIsDeletePopupOpen(false);
      setSelectedAppId(null);
    
  };

  const handleEditRow = (selectedRow) => {
    const transformedApp = {
      id: selectedRow.id,
      name: selectedRow.name,
      description: selectedRow.description,
      owner_id: selectedRow.ownerId,
      full_name: selectedRow.ownerName,
      email: selectedRow.ownerContact,
      //layerName: selectedRow.layers || [], // Ajout direct des layers depuis selectedRow
    layerName: selectedRow.layers 
      ? selectedRow.layers.map(layer => ({
          label: layer.name || layer, // S'adapte selon que layer est un objet ou une string
          value: layer.id || layer    // Utilise l'ID si disponible, sinon la valeur directe
        })) 
      : []
    };
    console.log(transformedApp)
    setSelectedApp(transformedApp);
    if (!showForm) onToggleForm();
  };

  // const handleDecisionResponse = (response) => {
  //   setShowDecisionPopup(false);
  //   if (response) {
  //     setIsAddingAnother(true);
  //   } else {
  //     setIsAddingAnother(false);
  //     onToggleForm();
  //   }
  // };

  const handleDecisionResponse = (response) => {
    setShowDecisionPopup(false);
    if (response) {
      setIsAddingAnother(true);
      setSelectedApp(null); // <-- Ajoutez cette ligne
    } else {
      setIsAddingAnother(false);
      onToggleForm();
      setSelectedApp(null); // <-- Ajoutez cette ligne
    }
  };

  return {
    applications,
    setApplications,
    isDeletePopupOpen,
    setIsDeletePopupOpen,
    selectedAppId,
    selectedApp,
    setSelectedApp,
    showDecisionPopup,
    setShowDecisionPopup,
    isAddingAnother,
    handleAddApp,
    handleDeleteRow,
    confirmDeleteMission,
    handleEditRow,
    handleDecisionResponse
  };
};