import React, { useContext, useEffect, useState } from "react";
import SideBar from "../components/sideBar/SideBar";
import HeaderBis from "../components/Header/HeaderBis";
import Table from "../components/Table";
import Spinner from "../components/Spinner";

import SearchBar from "../components/SearchBar";
import HeaderWithAction from "../components/Header/HeaderWithAction";
import AddUserForm from "../components/Forms/AddUserForm";
import {
  PersonOutlineRounded,
  ErrorOutline as ErrorOutlineIcon,
} from "@mui/icons-material";
import { SquarePen } from "lucide-react";
import ExportButton from "../components/ExportButton";
import PopUp from "../components/PopUps/PopUp";
import DecisionPopUp from "../components/PopUps/DecisionPopUp";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { PermissionRoleContext } from "../Context/permissionRoleContext";
import { Snackbar } from "@mui/material";
import useUser from "../Hooks/useUser";
import { useAuth } from "../Context/AuthContext";
function GestionUtilisateur() {
    const { viewMode, changeViewMode, user } = useAuth();
   
     useEffect(() => {
       if (user?.role === 'admin' && viewMode !== 'admin') {
         changeViewMode('admin');
       }
     }, [user, viewMode, changeViewMode]);
  const {
    filteredRows,
    setFilteredRows,
    loading,
    handleDeleteRow,
    selectedAppId,
    setSelectedAppId,
    isDeletePopupOpen,
    setIsDeletePopupOpen,
    confirmDeleteApp,
    snackbarMessage,
    setSnackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
    snackbarSeverity,
    setSnackbarSeverity,
    ResetShow,
    setResetShow,
    handleResetRow,
    handleResetConfirm,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedApp,
    setSelectedApp,
    handleEditRow,
    handleUpdateApp,
    handleUserCreation,
    isModalOpen,
    setIsModalOpen,
  } = useUser();
  // Configuration des colonnes de la table
  const columnsConfig2 = [
    //{ field: 'utilisateur', headerName: 'Utilisateur', width: 180, editable: false },
    { field: "nom", headerName: "Nom", width: 160, editable: true,expandable: true },
    { field: "prenom", headerName: "Prénom", width: 150, editable: true ,expandable: true},
    { field: "grade", headerName: "Grade", width: 180 ,expandable: true},
    {
      field: "email",
      headerName: "Email",
      width: 260,
      expandable: true,
      maxInitialLength: 20,
    },
    { field: "contact", headerName: "Contact", width: 200 ,expandable: true},
    {
      field: "lastPasswordChange",
      headerName: "Dernière modification du mot de passe",
      width: 300,
      expandable: true,
      maxInitialLength: 20,
    },
    { field: "dateField", headerName: "Dernière Activité", width: 150,expandable:true },
    { field: "dateField1", headerName: "Date d'ajout", width: 130,expandable:true },
    { field: "status", headerName: "Status", width: 140 },
    { field: "actions", headerName: "Actions", width: 80 },
  ];

  // Données initiales des utilisateurs
  const rowsData2 = [
    {
      id: 1,
      username: "manel.mohandouali",
      nom: "Mohand Ouali",
      prenom: "Manel",
      grade: "Stagiaire",
      email: "manel.mohandouali@mazars.dz",
      contact: "0659195905",
      dateField: "2024-12-27",
      dateField1: "2024-12-27",
      status: "Active",
    },
    {
      id: 2,
      username: "thanina.mecherak",
      nom: "Mecherak",
      prenom: "Thanina",
      grade: "Stagiaire",
      email: "thanina.mecherak@mazars.dz",
      contact: "0659195905",
      dateField: "2024-12-27",
      dateField1: "2024-12-27",
      status: "Active",
    },
  ];

  // Accédez à userRole et setUserRole via le contexte
 // const { userRole, setUserRole } = useContext(PermissionRoleContext);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Options et couleurs de statut utilisateur
  const statusOptions = ["Actif", "Bloqué"];
  const statusColors = { Actif: "green", Bloqué: "red" };

  /*
// Confirmation de la suppression
const confirmDeleteApp = () => {
   if (selectedAppId !== null) {
       setFilteredRows(prevRows => prevRows.filter(row => row.id !== selectedAppId));
   }
   setIsDeletePopupOpen(false);
   setSelectedAppId(null);
};*/

  const rowActions = [
    {
      icon: <PersonOutlineRounded sx={{ marginRight: "8px" }} />,
      label: "Voir Profile",
      onClick: handleEditRow,
    },
    {
      icon: <SquarePen className="mr-2" />,
      label: "Modifier",
      onClick: (selectedRow) => handleEditRow(selectedRow),
    },
    {
      icon: <RestartAltIcon className="mr-2" />,
      label: "Réinitialiser",
      onClick: (selectedRow) => {
        handleResetRow(selectedRow);
      },
      disabled: (selectedRow) => {
        return !selectedRow || !["Actif"].includes(selectedRow.status);
      },
    },
    {
      icon: (
        <ErrorOutlineIcon
          style={{ color: "var(--alert-red)", marginRight: "8px" }}
        />
      ),
      label: "Supprimer utilisateur",
      onClick: (selectedRow) => handleDeleteRow(selectedRow),
    },
  ];

  // Gestion de la recherche d'utilisateur
  const handleSearchResults = (results) => setFilteredRows(results);

  const handleCellEditCommit = (params) => {
    console.log("Cellule éditée :", params);
    setFilteredRows((prevRows) =>
      prevRows.map((row) =>
        row.id === params.id ? { ...row, [params.field]: params.value } : row
      )
    );
    console.log("Cellule éditée :", params);
  };

  return (
    <div className="flex">
      {/* Sidebar pour la navigation */}
      <SideBar user={user} className="flex-shrink-0 h-full fixed" />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <HeaderBis />
        <HeaderWithAction
          title="Utilisateurs"
          buttonLabel="Ajouter un utilisateur"
          onButtonClick={openModal}
          user={user}
        />

        {/* Barre de recherche */}
        <div className="flex justify-center mb-3">
          <SearchBar
            columnsConfig={columnsConfig2}
            initialRows={filteredRows}
            onSearch={handleSearchResults}
          />
        </div>

        {/* Bouton d'exportation */}
        <div className="flex justify-end items-center pr-10 mb-2">
        <ExportButton
  rowsData={filteredRows}
  columns={columnsConfig2}
  fileName={`List_Utilisateurs_${
    new Date().getMonth() + 1
  }_${new Date().getFullYear()}`}
/>
        </div>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "center", horizontal: "center" }}
          message={snackbarMessage}
          ContentProps={{
            sx: {
              backgroundColor: snackbarSeverity === "success" ? "green" : "red",
              color: "white",
            },
          }}
        />
        {/* Table d'affichage des utilisateurs */}
        <div
          className={`flex-1 overflow-x-auto mx-6 overflow-y-auto h-[400px]  ${
            isDeletePopupOpen ? "blur-sm" : ""
          }`}
        >
          {loading ? (
            <Spinner color="var(--blue-menu)" />
          ) : (
            <Table
              key={JSON.stringify(filteredRows)}
              columnsConfig={columnsConfig2}
              rowsData={filteredRows}
              checkboxSelection={false}
              headerBackground="var(--blue-nav)"
              statusOptions={statusOptions}
              statusColors={statusColors}
              rowActions={rowActions}
              onCellEditCommit={handleCellEditCommit}
            />
          )}
        </div>
      </div>

      {/* Modal d'ajout d'un utilisateur */}
      <AddUserForm
        title={"Ajouter un nouveau utilisateur"}
        loading={loading}
        isOpen={isModalOpen}
        onClose={closeModal}
        onUserCreated={handleUserCreation}
      />

      {isEditModalOpen && (
        <AddUserForm
          loading={loading}
          title={"Modifier un utilisateur"}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialValues={selectedApp || {}}
          onUserCreated={handleUpdateApp}
        />
      )}
      {isDeletePopupOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1">
          {" "}
          <DecisionPopUp
            loading={loading}
            name={
              filteredRows.find((row) => row.id === selectedAppId)?.username ||
              "cet utilisateur"
            }
            text="Êtes-vous sûr(e) de vouloir supprimer l'utilisateur "
            handleConfirm={confirmDeleteApp}
            handleDeny={() => setIsDeletePopupOpen(false)}
          />{" "}
        </div>
      )}
      {ResetShow && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1">
          {" "}
          <DecisionPopUp
            loading={loading}
            name={
              filteredRows.find((row) => row.id === selectedAppId)?.username ||
              "ce utilisateur"
            }
            text="Êtes-vous sûr(e) de vouloir réinisialiser le mot de passe "
            handleConfirm={handleResetConfirm}
            handleDeny={() => setResetShow(false)}
          />{" "}
        </div>
      )}
    </div>
  );
}

export default GestionUtilisateur;
