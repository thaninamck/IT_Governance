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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import ImportCsvButton from "../components/ImportXcelButton";
import StatusMission from "../components/StatusMission";
import useGestionMission from "../Hooks/useGestionMission";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import SideBarStdr from "../components/sideBar/SideBarStdr";
import { useProfile } from "../Context/ProfileContext";



function GestionMission() {
  const navigate = useNavigate();
 const { user,viewMode} = useAuth();
 const { profile } = useProfile();
 

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
    changeStatus,
    denyChangeStatus,
  } = useGestionMission(user,viewMode,profile);

  console.log(user)
  // Colonnes de la table
  const columnsConfig2 = [
    { field: "clientName", headerName: "Client", width: 170 },
    { field: "missionName", headerName: "Mission", width: 170 },
    ...(user?.role === "admin" 
      ? [{ field: "manager", headerName: "Manager", width: 200 }]
      : [{ field: "profileName", headerName: "Profile", width: 150 }]
  ),
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
    ...(activeView === "requeststatus"
      ? [{
          field: "request",
          headerName: "Action",
          width: 200,
          customRenderCell: (params) => {
            return (
              <div className="flex gap-4">
                <CheckCircleIcon
                  className="text-green-600 cursor-pointer hover:text-green-800"
                  onClick={() => changeStatus(params.row)}
                />
                <CancelIcon
                  className="text-red-600 cursor-pointer hover:text-red-800"
                  onClick={() => denyChangeStatus(params.row)}
                />
              </div>
            );
          },
        }]
      : [{
          field: "actions",
          headerName: "Actions",
          width: 80,
        }]
    )
    
    
  ];

  // Actions sur les lignes de la table
  const rowActions = [
    ...(user?.role === "admin" 
      ? [
          {
            icon: <ArchiveRoundedIcon sx={{ marginRight: "5px" }} />,
            label: "archivée",
            onClick: handleArchiverRow,
            disabled: (selectedRow) =>
              !selectedRow || !["clôturée", "en_retard"].includes(selectedRow.status),
          },
        ]
      : []),
    {
      icon: <LockOpenRoundedIcon sx={{ marginRight: "5px" }} />,
      label: "Clôturée",
      onClick: handleCloturerRow,
      disabled: (selectedRow) =>
        !selectedRow || !["en_cours", "en_retard"].includes(selectedRow.status),
    },
   
          {
            icon: <HighlightOffRoundedIcon sx={{ marginRight: "5px" }} />,
            label: "Annulée",
            onClick: handleCancelRow,
            disabled: (selectedRow) =>
              !selectedRow ||
              !["non_commencee", "en_cours", "en_attente","en_attente_annulation"].includes(selectedRow.status),
          },
       
    ...(user?.role === "admin" 
      ? [
          {
            icon: (selectedRow) =>
              selectedRow?.status === "en_attente" ? (
                <PlayCircleOutlineRoundedIcon sx={{ marginRight: "5px" }} />
              ) : (
                <PauseCircleOutlineRoundedIcon sx={{ marginRight: "5px" }} />
              ),
            label: (selectedRow) =>
              selectedRow?.status === "en_attente" ? "Reprendre" : "Pause",
            onClick: handlePauseRow,
            disabled: (selectedRow) =>
              !selectedRow || !["en_cours", "en_attente","non_commencee"].includes(selectedRow.status),
          },
        ]
      : []),
    {
      icon: <SquarePen className="mr-2" />,
      label: "Modifier",
      onClick: handleEditRow,
    },
    ...(user?.role === "admin" 
      ? [
          {
            icon: (
              <DeleteOutlineRoundedIcon
                sx={{ color: "var(--alert-red)", marginRight: "5px" }}
              />
            ),
            label: "Supprimer mission",
            onClick: handleDeleteRow,
          },
        ]
      : []),
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
      {user?.role === "admin" ? (
        <SideBar user={user} />
      ) : (
        <SideBarStdr user={user} />
      )}
      
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <HeaderBis />
        <HeaderWithAction
          title="Missions"
          buttonLabel="Créer une mission"
           onButtonClick={() => setIsModalOpen(true)}
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
          <ImportCsvButton onDataImported={handleDataImported} />
          {/* <ExportButton
            rowsData={filteredRows}
            headers={columnsConfig2.map((col) => col.headerName)}
            fileName="missions"
          /> */}
          <ExportButton
  rowsData={filteredRows}
  columns={columnsConfig2}
  fileName="missions"
/>

        </div>

        {/* Boutons pour basculer entre les vues */}
        {user?.role === "admin"  &&
          <div className="flex border-b-2 border-gray-300 mb-3 ml-8 ">
            <button
              className={`px-4 py-2 ${activeView === "active"
                  ? "rounded-l rounded-r-none border-none bg-gray-200 text-gray-700 "
                  : "rounded-none text-[var(--subfont-gray)] border-none "
                } `}
              onClick={() => setActiveView("active")}
            >
              Missions Actives
            </button>
            <button
              className={`px-4 py-2 ${activeView === "archived"
                  ? " rounded-r rounded-l-none  border-none bg-gray-200 text-gray-700"
                  : "rounded-none text-[var(--subfont-gray)] border-none"
                } `}
              onClick={() => setActiveView("archived")}
            >
              Missions Archivées
            </button>
            <button
              className={`px-4 py-2 ${activeView === "requeststatus"
                  ? " rounded-r rounded-l-none  border-none bg-gray-200 text-gray-700"
                  : "rounded-none text-[var(--subfont-gray)] border-none"
                } `}
              onClick={() => setActiveView("requeststatus")}
            >
              Request status mission
            </button>
          </div>}

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
              // rowsData={filteredRows}
              rowsData={missionsToDisplay}
              checkboxSelection={false}
              // getRowLink={getRowLink}
              onRowClick={handleRowClick}
              headerTextBackground={"white"}
              headerBackground="var(--blue-menu)"
              // rowActions={rowActions}
              rowActions={rowActions.filter((action) =>
                activeView === "archived" ? action.label !== "archivée" : true
              )}
            />
          )}
          {/* <AdminActionsPanel
        pendingActions={pendingActions}
        onValidateAction={handleValidateAction}
        onRejectAction={handleRejectAction}
      /> */}
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
        onClose={() => setIsModalOpen(false)}
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
                ?.missionName || "cette mission"
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
