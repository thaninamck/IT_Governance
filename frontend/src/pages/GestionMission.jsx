import React, { useState,useEffect } from "react";
import SideBar from "../components/sideBar/SideBar";
import HeaderBis from "../components/Header/HeaderBis";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import { SquarePen } from "lucide-react";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import HeaderWithAction from "../components/Header/HeaderWithAction";
import AddMissionForm from "../components/Forms/AddMissionForm";
import PopUp from "../components/PopUps/PopUp";
import DecisionPopUp from "../components/PopUps/DecisionPopUp";
import ExportButton from "../components/ExportButton";
import AddRisqueForm from "../components/Forms/AddRisqueForm";
import AddControleForm from "../components/Forms/AddControleForm";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useBreadcrumb } from "../Context/BreadcrumbContext";
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import { Snackbar } from "@mui/material";

function GestionMission() {

  // Colonnes de la table
  const columnsConfig2 = [
    { field: "client", headerName: "Client", width: 170 },
    { field: "mission", headerName: "Mission", width: 170 },
    { field: "manager", headerName: "Manager", width: 200 },
    { field: "dateField", headerName: "Date de début", width: 150 },
    { field: "dateField1", headerName: "Date fin", width: 150 },
    {
      field: "auditPeriod",
      headerName: "Période auditée",
      width: 250,
      customRenderCell: (params) => {
        const startDate = new Date(params.row.auditStartDate).toLocaleDateString("fr-FR");
        const endDate = new Date(params.row.auditEndDate).toLocaleDateString("fr-FR");
        return `De ${startDate} à ${endDate}`;
      },
    },
    { field: "statusMission", headerName: "Status", width: 220 },
    { field: "actions", headerName: "Actions", width: 80 },
  ];

  // Données des missions
  const rowsData2 = [
    {
      id: 1,
      statusMission: "en_cours",
      mission: "DSP",
      client: "Djeezy",
      manager: "Houda Elmaouhab",
      dateField: "2025-01-27",
      dateField1: "2025-2-7",
      auditStartDate: "2024-01-01", // Date de début de la période auditée
      auditEndDate: "2024-12-31",   // Date de fin de la période auditée
    },
    {
      id: 2,
      statusMission: "terminee",
      mission: "DSP1",
      client: "Oredoo",
      manager: "Sara Lounes",
      dateField: "2024-11-27",
      dateField1: "2025-02-25",
      auditStartDate: "2024-02-01", // Date de début de la période auditée
      auditEndDate: "2024-11-30",   // Date de fin de la période auditée
    },
    {
      id: 3,
      statusMission: "non_commencee",
      mission: "DSP2",
      client: "Oredoo",
      manager: "Sara Lounes",
      dateField: "2025-06-27",
      dateField1: "2025-12-27",
      auditStartDate: "2024-02-01", // Date de début de la période auditée
      auditEndDate: "2024-11-30",   // Date de fin de la période auditée
    },
    {
      id: 4,
      statusMission: "en_retard",
      mission: "DSP3",
      client: "Oredoo",
      manager: "Sara Lounes",
      dateField: "2025-01-27",
      dateField1: "2025-02-27",
      auditStartDate: "2024-02-01", // Date de début de la période auditée
      auditEndDate: "2024-11-30",   // Date de fin de la période auditée
    },
    {
      id: 5,
      statusMission: "archiver",
      mission: "DSP4",
      client: "Oredoo",
      manager: "Sara Lounes",
      dateField: "2025-06-27",
      dateField1: "2025-12-27",
      auditStartDate: "2024-02-01", // Date de début de la période auditée
      auditEndDate: "2024-11-30",   // Date de fin de la période auditée
    },
    {
      id: 6,
      statusMission: "annulée",
      mission: "DSP5",
      client: "Oredoo",
      manager: "Sara Lounes",
      dateField: "2025-06-27",
      dateField1: "2025-12-27",
      auditStartDate: "2024-02-01", // Date de début de la période auditée
      auditEndDate: "2024-11-30",   // Date de fin de la période auditée
    },
    {
      id: 7,
      statusMission: "temporaire",
      mission: "DSP6",
      client: "Oredoo",
      manager: "Sara Lounes",
      dateField: "2025-06-27",
      dateField1: "2025-12-27",
      auditStartDate: "2024-02-01", // Date de début de la période auditée
      auditEndDate: "2024-11-30",   // Date de fin de la période auditée
    },
    // ... autres missions
  ];

  // Fonction pour déterminer le statut automatique
  const getAutomaticStatus = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentDate < start) {
      return "non_commencee";
    } else if (currentDate >= start && currentDate <= end) {
      return "en_cours";
    } else if (currentDate > end) {
      return "en_retard";
    }
    return "Statut inconnu";
  };

 

  // Mettre à jour les statuts des missions
  const updateMissionStatuses = (missions) => {
    return missions.map((mission) => ({
      ...mission,
      statusMission: getAutomaticStatus(mission.dateField, mission.dateField1),
    }));
  };

  // Utiliser useEffect pour mettre à jour les statuts lors du chargement du composant
  useEffect(() => {
    const updatedRows = updateMissionStatuses(rowsData2);
    setFilteredRows(updatedRows);
  }, []); // Exécuter une seule fois au montage du composant

  // États pour gérer les modales et les missions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMissionCreated, setIsMissionCreated] = useState(false);
  const [filteredRows, setFilteredRows] = useState(rowsData2);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState(null);

  // Fonction pour ouvrir et fermer la modale d'ajout de mission
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Ferme le popup de confirmation
  const handlePopupClose = () => setIsMissionCreated(false);

 

  // Mise à jour des missions après une recherche
  const handleSearchResults = (results) => setFilteredRows(results);

  // Ajout d'une nouvelle mission
  const handleMissionCreation = (newMission) => {
    setFilteredRows((prevRows) => [
      ...prevRows,
      { id: prevRows.length + 1, ...newMission },
    ]);
    setIsMissionCreated(true);
    setIsModalOpen(false);
  };

   // Fonction pour archiver une mission
const handleArchiverRow = (selectedRow) => {
  // Mettre à jour le statut de la mission en "archiver"
  const updatedRows = filteredRows.map((row) =>
    row.id === selectedRow.id ? { ...row, statusMission: "archiver" } : row
  );

  // Mettre à jour l'état des lignes filtrées
  setFilteredRows(updatedRows);

  console.log("Mission archivée :", selectedRow);
};

const handleCloturerRow = (selectedRow) => {
  // Mettre à jour le statut de la mission en "archiver"
  const updatedRows = filteredRows.map((row) =>
    row.id === selectedRow.id ? { ...row, statusMission: "terminer" } : row
  );

  // Mettre à jour l'état des lignes filtrées
  setFilteredRows(updatedRows);

  console.log("Mission cloturée :", selectedRow);
};


const handleCancelRow = (selectedRow) => {
  // Mettre à jour le statut de la mission en "archiver"
  const updatedRows = filteredRows.map((row) =>
    row.id === selectedRow.id ? { ...row, statusMission: "annulée" } : row
  );

  // Mettre à jour l'état des lignes filtrées
  setFilteredRows(updatedRows);

  console.log("Mission annulée :", selectedRow);
};

const [previousStatus, setPreviousStatus] = useState({});
const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  
const handlePauseRow = (selectedRow) => {
  if (selectedRow.statusMission === "temporaire") {
    // Calculer la nouvelle date de début (date actuelle)
    const newStartDate = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
const missionEndDate = new Date(selectedRow.dateField1).toISOString().split("T")[0]; // Convertir en format YYYY-MM-DD


    console.log("Nouvelle date de début :", newStartDate);
    console.log("Date de fin de la mission :", selectedRow.dateField1);

    // Vérifier si la nouvelle date de début est supérieure à la date de fin
    if (newStartDate > missionEndDate) {
      // Afficher une alerte ou un message d'erreur
      console.log("La mission ne peut pas être reprise car la date de début serait supérieure à la date de fin.");
       setSnackbarMessage("La mission ne peut pas être reprise car la date de début serait supérieure à la date de fin.");
      setSnackbarOpen(true); // Afficher la notification
      return; // Ne pas mettre à jour la mission
    }

    // Si la date de début est valide, reprendre la mission
    const updatedRows = filteredRows.map((row) =>
      row.id === selectedRow.id
        ? {
            ...row,
            statusMission: previousStatus[selectedRow.id], // Restaurer l'état précédent
            dateField: newStartDate, // Mettre à jour la date de début avec la date actuelle
          }
        : row
    );
    setFilteredRows(updatedRows);

    // Supprimer l'état précédent de la mémoire
    setPreviousStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[selectedRow.id];
      return newStatus;
    });
  } else {
    // Si la mission n'est pas en pause, la mettre en pause
    setPreviousStatus((prev) => ({
      ...prev,
      [selectedRow.id]: selectedRow.statusMission, // Stocker l'état actuel
    }));
    const updatedRows = filteredRows.map((row) =>
      row.id === selectedRow.id ? { ...row, statusMission: "temporaire" } : row
    );
    setFilteredRows(updatedRows);
  }
};


  // Modification d'une mission
  const handleEditRow = (selectedRow) => {
    // const missionToEdit = filteredRows.find(row => row.id === rowId);
    setSelectedMission(selectedRow);
    setIsEditModalOpen(true);
    console.log(selectedRow);
  };

  // Mise à jour des missions après modification
  const handleUpdateMission = (updatedMission) => {
    setFilteredRows((prevRows) =>
      prevRows.map((row) =>
        row.id === updatedMission.id ? updatedMission : row
      )
    );
    setIsEditModalOpen(false);
    setSelectedMission(null);
  };

  // Suppression d'une mission
  const handleDeleteRow = (selectedRow) => {
    setSelectedMissionId(selectedRow.id);
    setIsDeletePopupOpen(true);
    console.log(selectedRow);
  };

  // Confirmation de la suppression
  const confirmDeleteMission = () => {
    if (selectedMissionId !== null) {
      setFilteredRows((prevRows) =>
        prevRows.filter((row) => row.id !== selectedMissionId)
      );
    }
    setIsDeletePopupOpen(false);
    setSelectedMissionId(null);
  };
  const { setBreadcrumbs } = useBreadcrumb();
  const navigate = useNavigate(); // Hook pour la navigation

   // Fonction pour récupérer le lien d'une mission
   //const getRowLink = (row) => `/tablemission/${row.mission}`;
  

  const handleRowClick = (rowData) => {
    // Naviguer vers la page de détails avec l'ID du contrôle dans l'URL
    navigate(`/tablemission/${rowData.mission}`, { state: { missionData: rowData }} );
   // navigate('/controle', { state: { controleData: rowData } });
    console.log('Détails du contrôle sélectionné:', rowData);
  };

  const getRowForReportLink = (row) => `/missions/${row.mission}`;

  const handleViewReport = (selectedRow) => {
    if (!selectedRow || !selectedRow.mission) {
      console.error("Mission non définie !");
      return;
    }

    const link = getRowForReportLink(selectedRow);

    // Met à jour les breadcrumbs
    setBreadcrumbs([
      { label: "rapportmission", path: "/missions" },

      {
        label: selectedRow.mission,
        path: `/missions/${selectedRow.mission}`,
      },
    ]);

    console.log("Mission sélectionnée :", selectedRow);

    // Navigation avec les données de mission
    navigate(link, { state: { missionData: selectedRow } });
  };

  // Actions sur les lignes de la table
  const rowActions = [
    {
      icon: <ArchiveRoundedIcon sx={{ marginRight: "5px" }} />,
      label: "Archiver",
      onClick: (selectedRow) => {
        //console.log("Selected Row:", selectedRow); // Debugging
        handleArchiverRow(selectedRow);
      },
      disabled: (selectedRow) => {
        //console.log("Selected Row in disabled:", selectedRow); // Debugging
        return !selectedRow || !["terminee", "en_retard"].includes(selectedRow.statusMission)
      },
    },
    {
      icon: <ArchiveRoundedIcon sx={{ marginRight: "5px" }} />,
      label: "Clôturée",
      onClick: (selectedRow) => {
        //console.log("Selected Row:", selectedRow); // Debugging
        handleCloturerRow(selectedRow);
      },
      disabled: (selectedRow) => {
       // console.log("Selected Row in disabled:", selectedRow); // Debugging
        return !selectedRow || !["en_cours", "en_retard"].includes(selectedRow.statusMission)
      },
    },
    {
      icon: <HighlightOffRoundedIcon sx={{ marginRight: "5px" }} />,
      label: "Annulée",
      onClick: (selectedRow) => {
       // console.log("Selected Row:", selectedRow); // Debugging
        handleCancelRow(selectedRow);
      },
      disabled: (selectedRow) => {
       // console.log("Selected Row in disabled:", selectedRow); // Debugging
        return !selectedRow || !["non_commencee", "en_cours","temporaire"].includes(selectedRow.statusMission)
      },
    },
    {
      icon: (selectedRow)=>{
        return selectedRow?.statusMission === "temporaire"? <PlayCircleOutlineRoundedIcon sx={{ marginRight: "5px" }}/> : <PauseCircleOutlineRoundedIcon sx={{ marginRight: "5px" }} />},
      label: (selectedRow) => {
       
        return selectedRow?.statusMission === "temporaire" ? "Reprendre" : "Pause";
      },
      onClick: (selectedRow) => {
        //console.log("Selected Row:", selectedRow); 
        handlePauseRow(selectedRow);
      },
      disabled: (selectedRow) => {
       // console.log("Selected Row in disabled:", selectedRow); 
        return !selectedRow || !["en_cours","temporaire"].includes(selectedRow.statusMission)
      },
    },
    
    {
      icon: <SquarePen className="mr-2" />,
      label: "Modifier",
      onClick: (selectedRow) => {
        handleEditRow(selectedRow);
      },
    },
    {
      icon: (
        <DeleteOutlineRoundedIcon
          sx={{ color: "var(--alert-red)", marginRight: "5px" }}
        />
      ),
      label: "Supprimer mission",
      onClick: (selectedRow) => {
        handleDeleteRow(selectedRow);
      },
    },
    {
      icon: (
        <VisibilityIcon
          sx={{ color: "var(--font-gray)", marginRight: "5px" }}
        />
      ),
      label: "Voir rapport",
      onClick: handleViewReport,
    },
  ];

  return (
    <div className="flex">
      <SideBar userRole="admin" className="flex-shrink-0 h-full fixed" />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <HeaderBis />
        <HeaderWithAction
          title="Missions"
          buttonLabel="Créer une mission"
          onButtonClick={openModal}
        />
        <div className="flex items-center justify-center mb-6">
          <SearchBar
            columnsConfig={columnsConfig2}
            initialRows={rowsData2}
            onSearch={handleSearchResults}
          />
        </div>
        <div className="flex justify-end items-center pr-10 mb-6">
          <ExportButton
            rowsData={filteredRows}
            headers={columnsConfig2.map((col) => col.headerName)}
            fileName="missions"
          />
        </div>
        <div
          className={`flex-1 overflow-x-auto overflow-y-auto h-[400px] transition-all ${
            isDeletePopupOpen ? "blur-sm" : ""
          }`}
        >
          <Table
            key={JSON.stringify(filteredRows)}
            
            columnsConfig={columnsConfig2}
            rowsData={filteredRows}
            checkboxSelection={false}
            // getRowLink={getRowLink}
            onRowClick={handleRowClick}
            headerTextBackground={"white"}
            headerBackground="var(--blue-menu)"
            rowActions={rowActions}
          />
        </div>
      </div>
      {/*  <AddRisqueForm
      title="Créer un nouveau risque"
      isOpen={isModalOpen}
      onClose={closeModal}
      onRisqueCreated={handleMissionCreation}
    />*/}
     {/* <AddControleForm
      title="Créer un nouveau risque"
      isOpen={isModalOpen}
      onClose={closeModal}
      onControleCreated={handleMissionCreation}
    /> */}
      <AddMissionForm
        title={"Ajouter une mission"}
        isOpen={isModalOpen}
        onClose={closeModal}
        onMissionCreated={handleMissionCreation}
      />

<Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
      {isMissionCreated && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <PopUp text="Mission créée" redirectionURL={handlePopupClose} />
        </div>
      )}
      {isEditModalOpen && (
        <AddMissionForm
          title={"Modifier une mission"}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialValues={selectedMission}
          onMissionCreated={handleUpdateMission}
        />
      )}
      {isDeletePopupOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1">
          {" "}
          <DecisionPopUp
            name={
              filteredRows.find((row) => row.id === selectedMissionId)
                ?.mission || "cette mission"
            }
            text="Êtes-vous sûr(e) de vouloir supprimer la mission "
            handleConfirm={confirmDeleteMission}
            handleDeny={() => setIsDeletePopupOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default GestionMission;
