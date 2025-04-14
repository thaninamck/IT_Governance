import React, { useState, useEffect, useContext } from "react";
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
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import { Snackbar } from "@mui/material";
import ImportCsvButton from "../components/ImportXcelButton";
import StatusMission from "../components/StatusMission";
import useGestionMission from "../Hooks/useGestionMission";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import SideBarStdr from "../components/sideBar/SideBarStdr";



function UserViewMode() {
  const navigate = useNavigate();
 const { user,viewMode} = useAuth();
 

  const {
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
  } = useGestionMission(user,viewMode);

  console.log(user)
  // Colonnes de la table
  const columnsConfig2 = [
    { field: "clientName", headerName: "Client", width: 170 },
    { field: "missionName", headerName: "Mission", width: 170 },
    { field: "manager", headerName: "Manager", width: 200 },
    { field: "startDate", headerName: "Date de début", width: 150 },
    { field: "endDate", headerName: "Date fin", width: 150 },
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
    {
      field: "status",
      headerName: "Status",
      width: 220,
      customRenderCell: (params) => {
        return <StatusMission status={params.row.status} />;
      },
    },
    { field: "actions", headerName: "Actions", width: 80 },
  ];

  // Actions sur les lignes de la table
  const rowActions = [
    {
      icon: (
        <VisibilityIcon sx={{ color: "var(--font-gray)", marginRight: "5px" }} />
      ),
      label: "Voir rapport",
      onClick: handleViewReport,
    },
  ];

  console.log(missionsToDisplay)
  return (
    <div className="flex">
    
       
        <SideBarStdr user={user} />      
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <HeaderBis />
        <HeaderWithAction
          title="Missions"
        user={user}
        />
        <div className="flex items-center justify-center mb-6">
          <SearchBar
            columnsConfig={columnsConfig2}
            initialRows={rowsData2}
            onSearch={handleSearchResults}
          />
        </div>
        <div className="flex justify-end items-center gap-4 pr-10 mb-6">
          <ExportButton
            rowsData={filteredRows}
            headers={columnsConfig2.map((col) => col.headerName)}
            fileName="missions"
          />
        </div>

        <div
          className={`flex-1 overflow-x-auto overflow-y-auto h-[400px] transition-all ${isDeletePopupOpen ? "blur-sm" : ""
            }`}
        >
          {missionsToDisplay.length === 0 ? (
            <p className="text-center text-subfont-gray mt-20">
              Aucune mission pour le moment. Vous pouvez charger un
              fichier Excel ?
            </p>
          ) : (
            <Table
              key={JSON.stringify(missionsToDisplay)}

              columnsConfig={columnsConfig2}
              rowsData={missionsToDisplay}
              checkboxSelection={false}
              onRowClick={handleRowClick}
              headerTextBackground={"white"}
              headerBackground="var(--blue-menu)"
              rowActions={rowActions.filter((action) =>
                activeView === "archived" ? action.label !== "archivée" : true
              )}
            />
          )}
         
        </div>

      </div>
     
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
      
    </div>
  );
}

export default UserViewMode;
