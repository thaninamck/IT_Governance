import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PermissionRoleContext } from "../Context/permissionRoleContext";
import { useBreadcrumb } from "../Context/BreadcrumbContext";
import {api} from "../Api";
import useAuth from "./useAuth";




const useGestionMission = (user,viewMode,profile) => {
 // const { user } = useAuth();
  const [rowsData2, setRowsData2] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [previousStatus, setPreviousStatus] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [pendingActions, setPendingActions] = useState([]);
  const [activeView, setActiveView] = useState("active");
  const [isMissionCreated, setIsMissionCreated] = useState(false);
 // const [missionsToDisplay, setMissionsToDisplay] = useState([])
  const [loading, setLoading] = useState(false);

 // const { userRole } = useContext(PermissionRoleContext);
  const { setBreadcrumbs } = useBreadcrumb();
  const navigate = useNavigate();

  //Récupérer les missions depuis l'API
  const fetchMissions = async () => {
    setLoading(true);
    try {
      const endpoint = user?.role === "admin" ? "/getmissions" : "/getmissions/user";
      const response = await api.get(endpoint);
      
      console.log('API response:', response.data);
      setRowsData2(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des missions:", error);
      // Optionnel: afficher un message à l'utilisateur
      setSnackbarMessage("Erreur lors du chargement des missions");
      setSnackbarOpen(true);
    }
  };

 
  //   const fetchMissions = async () => {
  //     console.log("Fetching missions for view:", activeView, "role:", user?.role);
  //     setLoading(true);
  //     try {
  //       let response;

  //       if (activeView === "active") {
  //         const endpoint = user?.role === "admin" ? "/getmissions" : "/getmissions/user";
  //  response = await api.get(endpoint);
  //  console.log('response',response.data)
      
  //       } else if (activeView === "archived") {
  //         response = await api.get("/missions/getarchivedmissions");
  //       } else {
  //         response = await api.get("/missions/getrequeststatusmission");
  //       }

  //       setRowsData2(response.data); // ou response.data.data selon ta structure API
  //     } catch (error) {
  //       console.error("Erreur lors du chargement des missions :", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

   

  useEffect(() => {
    console.log('Current user role:', user?.role);
    fetchMissions();
  }, [ user?.role]);

  // Mettre à jour les missions filtrées
  useEffect(() => {
    setFilteredRows(rowsData2);
  }, [rowsData2]);

  // Gérer la création d'une mission
  const handleMissionCreation = async (newMission) => {
    try {
      const response = await api.post("/createmissions", newMission);
      const createdMission = response.data.mission;
      setRowsData2((prevRows) => [...prevRows, createdMission]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création d'une mission:", error);
    }
  };

   // Mise à jour des missions après une recherche
   const handleSearchResults = (results) => setFilteredRows(results);
  

  const changeStatus = async (selectedRow) => {
    try {
      await api.put(`/acceptrequeststatus/${selectedRow.id}`);
      await fetchMissions();
    } catch (error) {
      console.error("Erreur lors de  status l'archivage de la mission:", error);
      alert("Erreur lors de l'archivage de la mission. Veuillez réessayer.");
    }
  };
  const  denyChangeStatus = async (selectedRow) => {
    try {
      await api.put(`/refuseRequestStatus/${selectedRow.id}`);
      await fetchMissions();
    } catch (error) {
      console.error("Erreur lors de  status l'archivage de la mission:", error);
      alert("Erreur lors de l'archivage de la mission. Veuillez réessayer.");
    }
  };
  // Gérer la clôture d'une mission
  // const handleCloturerRow = async (selectedRow) => {
  //   if (user?.role !== "admin"){
  //     setPendingActions((prevActions) => [
  //       ...prevActions,
  //       {
  //         id: selectedRow.id,
  //         type: "cloturer",
  //         row: selectedRow,
  //         requestedBy: user?.role,
  //         timestamp: new Date(),
  //       },
  //     ]);
  //     setSnackbarMessage("Votre demande de clôture est en attente de validation.");
  //     setSnackbarOpen(true);
  //     return;
  //   }

  //   try {
  //     await api.put(`/closemission/${selectedRow.id}`);
  //     await fetchMissions();
  //   } catch (error) {
  //     console.error("Erreur lors de la clôture de la mission:", error);
  //     alert("Erreur lors de la clôture de la mission. Veuillez réessayer.");
  //   }
  // };

  const handleCloturerRow = async (selectedRow) => {
    try {
      let response;
      
      if (user?.role === "admin") {
        response = await api.put(`/closemission/${selectedRow.id}`);
      } else if (user?.role === "user" && selectedRow.profileName=== "manager") {
        response = await api.put(`/missions/${selectedRow.id}/requestCloseMission`);
      } else {
        throw new Error("Action non autorisée");
      }
  
    // Gestion plus robuste de la réponse
    if (response.status === 200 || response.status === 201) {
      setSnackbarMessage(
        user?.role === "admin" 
          ? "Mission cloturé avec succès" 
          : "Demande d'e cloture envoyée"
      );
      setSnackbarOpen(true);
        await fetchMissions();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Erreur détaillée:", error.response?.data || error.message);
      setSnackbarMessage(
        error.response?.data?.message || 
        error.message || 
        "Une erreur est survenue lors de l'opération"
      );
      setSnackbarOpen(true);
    }
  };
  
  // Gérer l'archivage d'une mission
  const handleArchiverRow = async (selectedRow) => {
    try {
      await api.put(`/archivemission/${selectedRow.id}`);
      await fetchMissions();
    } catch (error) {
      console.error("Erreur lors de l'archivage de la mission:", error);
      alert("Erreur lors de l'archivage de la mission. Veuillez réessayer.");
    }
  };
 
  
  // Gérer l'annulation d'une mission
 
// const handleCancelRow = async (selectedRow) => {
//   try {
//     console.log("annuler",selectedRow)
//     if (user?.role === "admin") {
//       console.log("userrole",user?.role)
//       await api.put(`/cancelmission/${selectedRow.id}`);
//     } else if (user?.role === "user" && profile === "manager") {
//       await api.put(`/requestcancelmission/${selectedRow.id}`);
//     }

//     await fetchMissions();
//   } catch (error) {
//     console.error("Erreur lors de l'annulation de la mission :", error);
//     alert("Erreur lors de l'annulation de la mission. Veuillez réessayer.");
//   }
// };

const handleCancelRow = async (selectedRow) => {
  try {
    let response;
    
    if (user?.role === "admin") {
      response = await api.put(`/missions/${selectedRow.id}/cancelmission`);
    } else if (user?.role === "user" && selectedRow.profileName=== "manager") {
      response = await api.put(`/missions/${selectedRow.id}/requestcancelmission`);
    } else {
      throw new Error("Action non autorisée");
    }

  // Gestion plus robuste de la réponse
  if (response.status === 200 || response.status === 201) {
    setSnackbarMessage(
      user?.role === "admin" 
        ? "Mission annulée avec succès" 
        : "Demande d'annulation envoyée"
    );
    setSnackbarOpen(true);
      await fetchMissions();
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Erreur détaillée:", error.response?.data || error.message);
    setSnackbarMessage(
      error.response?.data?.message || 
      error.message || 
      "Une erreur est survenue lors de l'opération"
    );
    setSnackbarOpen(true);
  }
};

  // // Gérer la pause/reprise d'une mission
  // const handlePauseRow = async (selectedRow) => {
  //   try {
  //     if (selectedRow.status === "en_attente") {
  //       const newStartDate = new Date().toISOString().split("T")[0];
  //       const response = await api.put(`/resumemission/${selectedRow.id}`, {
  //         previous_status_id: previousStatus[selectedRow.id],
  //         new_start_date: newStartDate,
  //       });

  //       setFilteredRows((prevRows) =>
  //         prevRows.map((row) =>
  //           row.id === selectedRow.id ? { ...row, status: response.data.status_id } : row
  //         )
  //       );

  //       setPreviousStatus((prev) => {
  //         const newStatus = { ...prev };
  //         delete newStatus[selectedRow.id];
  //         return newStatus;
  //       });
  //     } else {
  //       const response = await api.put(`/stopmission/${selectedRow.id}`);
  //       setPreviousStatus((prev) => ({
  //         ...prev,
  //         [selectedRow.id]: response.data.previous_status_id,
  //       }));

  //       setFilteredRows((prevRows) =>
  //         prevRows.map((row) =>
  //           row.id === selectedRow.id ? { ...row, status: "en_attente" } : row
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Erreur lors de la gestion de la mission :", error);
  //     setSnackbarMessage(
  //       error.response?.data?.message || "Une erreur s'est produite lors de la gestion de la mission."
  //     );
  //     setSnackbarOpen(true);
  //   }
  // };


  // Gérer la pause/reprise d'une mission
const handlePauseRow = async (selectedRow) => {
  try {
    if (selectedRow.status === "en_attente") {
      // Reprise de la mission (PAS besoin d'envoyer de données)
      const response = await api.put(`/resumemission/${selectedRow.id}`);
      await fetchMissions();
      // Mettre à jour les données localement
      setFilteredRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedRow.id ? { ...row, status: response.data.status } : row
        )
      );


    } else {
      // Pause de la mission
      const response = await api.put(`/stopmission/${selectedRow.id}`);
      await fetchMissions();
      setFilteredRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedRow.id ? { ...row, status: response.data.status } : row
        )
      );
    }
  } catch (error) {
    console.error("Erreur lors de la gestion de la mission :", error);

    // Extraire le message d'erreur du backend
    const backendMessage =
      error.response?.data?.data?.error || // message  côté Laravel
      "Une erreur s'est produite lors de la gestion de la mission.";

      console.log("back",error.response?.data?.data?.error )
    // Si l'erreur est liée à la date de fin dépassée
    const finalMessage = backendMessage.includes("date actuelle dépasse la date de fin")
      ? `${backendMessage}. Vous devez modifier la date de fin pour pouvoir reprendre la mission.`
      : backendMessage;

    // Afficher le message dans le snackbar
    setSnackbarMessage(finalMessage);
    setSnackbarOpen(true);
  }
};


  // Gérer la modification d'une mission
  const handleEditRow = (selectedRow) => {
    console.log('data edit', selectedRow)
    const transformedMission = {
      id: selectedRow.id,
      mission_name: selectedRow.missionName,
      client_id: selectedRow.clientId,
      client_name: selectedRow.clientName,
      manager_id: selectedRow.managerID,
      manager_name: selectedRow.manager,
      start_date: selectedRow.startDate,
      end_date: selectedRow.endDate,
      audit_start_date: selectedRow.auditStartDate,
      audit_end_date: selectedRow.auditEndDate,
    };
    console.log("Transformed Mission:", transformedMission);
    setSelectedMission(transformedMission);
    setIsEditModalOpen(true);
  };

  // Gérer la mise à jour d'une mission
  const handleUpdateMission = async (updatedMission) => {
    console.log("Données envoyées :", updatedMission); // Inspecter les données
    try {
      const response = await api.put(`/updatemissionID/${updatedMission.id}`, updatedMission);
      console.log("Réponse du serveur :", response.data); // Inspecter la réponse
      setFilteredRows((prevRows) =>
        prevRows.map((row) =>
          row.id === updatedMission.id ? response.data : row
        )
      );
      setIsEditModalOpen(false);
      setSelectedMission(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la mission:", error);
    }
  };

  // Gérer la suppression d'une mission
  const handleDeleteRow = (selectedRow) => {
    setSelectedMissionId(selectedRow.id);
    setIsDeletePopupOpen(true);
  };

  // Confirmer la suppression d'une mission
  const confirmDeleteMission = async () => {
    try {
      await api.delete(`/deletemissionID/${selectedMissionId}`);
      setFilteredRows((prevRows) =>
        prevRows.filter((row) => row.id !== selectedMissionId)
      );
    } 
    catch (error) {
      console.error("Erreur lors de la suppression de la mission:", error);
  
      // Extraire le message d'erreur du backend
      const backendMessage =
        error.response?.data?.data?.error || // message  côté Laravel
        "Une erreur s'est produite lors de la suppression de la mission.";
  
        console.log("back",error.response?.data?.data?.error )
      // Si l'erreur est liée à la date de fin dépassée
      const finalMessage = backendMessage
  
      // Afficher le message dans le snackbar
      setSnackbarMessage(finalMessage);
      setSnackbarOpen(true);
    }
    setIsDeletePopupOpen(false);
    setSelectedMissionId(null);
  };

   // Fonction pour récupérer le lien d'une mission
  //const getRowLink = (row) => `/tablemission/${row.mission}`;
  const handleRowClick = (rowData) => {
    // Naviguer vers la page de détails avec l'ID du contrôle dans l'URL
    if((user?.role=== 'admin' && viewMode ==='admin')|| user?.role==='user'){
    navigate(`/missions/${rowData.missionName}`, { state: { missionData: rowData } });
    console.log('Détails du contrôle sélectionné:', rowData);
    }
  };
  // Gérer la navigation vers le rapport d'une mission
  const handleViewReport = (selectedRow) => {
    if (!selectedRow || !selectedRow.mission) {
      console.error("Mission non définie !");
      return;
    }

    const link = `/rapportmissions/${selectedRow.mission}`;
    setBreadcrumbs([
      { label: "rapportmission", path: "/missions" },
      { label: selectedRow.mission, path: `/missions/${selectedRow.mission}` },
    ]);

    navigate(link, { state: { missionData: selectedRow } });
  };

   // Fonction pour gérer les données importées
   const handleDataImported = (importedData) => {
    // Ignorer la première ligne (en-tête)
    const dataWithoutHeader = importedData.slice(1);
    // Convertir les données importées en format compatible avec rowsData2
    const newRows = dataWithoutHeader.map((row, index) => ({
      id: row[0], // Générer un ID unique
      client: row[3],
      mission: row[2],
      manager: row[4],
      startDate: row[5],
      endDate: row[6],
      auditStartDate: row[7],
      auditEndDate: row[8],
      status: getAutomaticStatus(row[5], row[6]), 
    }));
}

const missionsToDisplay =
activeView === "active"
  ? filteredRows.filter((mission) =>
      ["clôturée", "en_attente", "en_retard", "en_cours", "non_commencee","annulée"].includes(mission.status)
    )
  : activeView === "archived"
  ? filteredRows.filter((mission) => mission.status === "archivée")
  : filteredRows.filter((mission) =>
      ["en_attente_archivage", "en_attente_annulation", "en_attente_de_clôture"].includes(mission.status)
    );

   

       // Ferme le popup de confirmation
  const handlePopupClose = () => setIsMissionCreated(false);
  // Retourner les états et fonctions nécessaires
  return {
    rowsData2,
    filteredRows,
    isModalOpen,
    isEditModalOpen,
    selectedMission,
    isDeletePopupOpen,
    selectedMissionId,
    previousStatus,
    snackbarOpen,
    snackbarMessage,
    pendingActions,
    activeView,
   // user,
    setActiveView,
    setIsModalOpen,
    setIsEditModalOpen,
    setIsDeletePopupOpen,
    setSnackbarOpen,
    handleMissionCreation,
    handleArchiverRow,
    handleCloturerRow,
    handleCancelRow,
    handlePauseRow,
    handleEditRow,
    handleUpdateMission,
    handleDeleteRow,
    confirmDeleteMission,
    handleViewReport,
    handleSearchResults,
    handleDataImported,
    missionsToDisplay,
    handlePopupClose,
    isMissionCreated,
    handleRowClick,
    changeStatus,
    denyChangeStatus,
  };
};

export default useGestionMission;