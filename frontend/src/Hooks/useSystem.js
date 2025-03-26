import { useState, useEffect } from 'react';
import { api } from '../Api';


export const useSystem = (missionId, userRole, showForm, onToggleForm) => {
  const [applications, setApplications] = useState([]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDecisionPopup, setShowDecisionPopup] = useState(false);
  const [isAddingAnother, setIsAddingAnother] = useState(false);

  // Récupérer les systèmes de la mission
  useEffect(() => {
    const fetchMissionSystems = async () => {
      try {
        const response = await api.get(`/mission/${missionId}/getsystems`);
        console.log('resp',response.data.systems)
        setApplications(response.data.systems);
      } catch (error) {
        console.error("Erreur lors de la récupération des systems:", error);
      } 
    };

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
          // Ajout d'une nouvelle application
        const response = await api.post(`/mission/${missionId}/createsystem`, app);
        setApplications(prev => [...prev, response.data]);
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
    const transformedMission = {
      id: selectedRow.id,
      name: selectedRow.name,
      description: selectedRow.description,
      owner_id: selectedRow.ownerId,
      full_name: selectedRow.ownerName,
      email: selectedRow.ownerContact,
    };
    setSelectedApp(transformedMission);
    if (!showForm) onToggleForm();
  };

  const handleDecisionResponse = (response) => {
    setShowDecisionPopup(false);
    if (response) {
      setIsAddingAnother(true);
    } else {
      setIsAddingAnother(false);
      onToggleForm();
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
    isAddingAnother,
    handleAddApp,
    handleDeleteRow,
    confirmDeleteMission,
    handleEditRow,
    handleDecisionResponse
  };
};