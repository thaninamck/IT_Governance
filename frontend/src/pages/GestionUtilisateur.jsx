import React, { useState } from 'react';
import SideBar from '../components/sideBar/SideBar';
import HeaderBis from '../components/Header/HeaderBis';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import HeaderWithAction from '../components/Header/HeaderWithAction';
import AddUserForm from '../components/Forms/AddUserForm';
import { PersonOutlineRounded, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import { SquarePen } from 'lucide-react';
import ExportButton from '../components/ExportButton';

function GestionUtilisateur() {

    // Configuration des colonnes de la table
  const columnsConfig2 = [
    { field: 'username', headerName: 'Nom utilisateur', width: 180, editable: false },
    { field: 'nom', headerName: 'Nom', width: 160, editable: true },
    { field: 'prenom', headerName: 'Prénom', width: 150 },
    { field: 'grade', headerName: 'Grade', width: 180 },
    { field: 'email', headerName: 'Email', width: 260, expandable: true, maxInitialLength: 20 },
    { field: 'contact', headerName: 'Contact', width: 120 },
    { field: 'dateField', headerName: 'Dernière Activité', width: 150 },
    { field: 'dateField1', headerName: "Date d'ajout", width: 130 },
    { field: 'status', headerName: 'Status', width: 140 },
    { field: 'actions', headerName: 'Actions', width: 80 },
  ];

  // Données initiales des utilisateurs
  const rowsData2 = [
    { id: 1, username: 'manel.mohandouali', nom: 'Mohand Ouali', prenom: 'Manel', grade: 'Stagiaire', email: 'manel.mohandouali@mazars.dz', contact: '0659195905', dateField: '2024-12-27', dateField1: '2024-12-27', status: 'Active' },
    { id: 2, username: 'thanina.mecherak', nom: 'Mecherak', prenom: 'Thanina', grade: 'Stagiaire', email: 'thanina.mecherak@mazars.dz', contact: '0659195905', dateField: '2024-12-27', dateField1: '2024-12-27', status: 'Active' },
  ];
  // État pour gérer l'affichage du modal d'ajout d'utilisateur
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredRows, setFilteredRows] = useState(rowsData2);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Options et couleurs de statut utilisateur
  const statusOptions = ["Active", "Bloqué"];
  const statusColors = { Active: 'green', Bloqué: 'red' };

  // Gestion des actions sur les lignes
  const handleEditRow = (rowId) => console.log("Modifier l'utilisateur:", rowId);
  const handleDeleteRow = (rowId) => console.log("Supprimer l'utilisateur:", rowId);

  const rowActions = [
    { icon: <PersonOutlineRounded />, label: "Voir Profile", onClick: handleEditRow },
    { icon: <SquarePen />, label: "Modifier", onClick: handleEditRow },
    { icon: <ErrorOutlineIcon style={{ color: 'red' }} />, label: "Supprimer utilisateur", onClick: handleDeleteRow },
  ];

  // Gestion de la recherche d'utilisateur
  const handleSearchResults = (results) => setFilteredRows(results);

  // Gestion de l'ajout d'un nouvel utilisateur
  const handleUserCreation = (newUser) => {
    setFilteredRows(prevRows => [...prevRows, { id: prevRows.length + 1, ...newUser }]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex">
      {/* Sidebar pour la navigation */}
      <SideBar userRole="admin" className="flex-shrink-0 h-full fixed" />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <HeaderBis />
        <HeaderWithAction title="Utilisateurs" buttonLabel="Ajouter un utilisateur" onButtonClick={openModal} />

        {/* Barre de recherche */}
        <div className="flex justify-center mb-6">
          <SearchBar columnsConfig={columnsConfig2} initialRows={rowsData2} onSearch={handleSearchResults} />
        </div>

        {/* Bouton d'exportation */}
        <div className="flex justify-end items-center pr-10 mb-6">
          <ExportButton rowsData={filteredRows} headers={columnsConfig2.map(col => col.headerName)} fileName={`List_Utilisateurs_${new Date().getMonth() + 1}_${new Date().getFullYear()}`} />
        </div>

        {/* Table d'affichage des utilisateurs */}
        <div className="flex-1 overflow-x-auto overflow-y-auto h-[400px]">
          <Table
            key={filteredRows.length}
            columnsConfig={columnsConfig2}
            rowsData={filteredRows}
            checkboxSelection={false}
            headerBackground="var(--blue-nav)"
            statusOptions={statusOptions}
            statusColors={statusColors}
            rowActions={rowActions}
          />
        </div>
      </div>

      {/* Modal d'ajout d'un utilisateur */}
      <AddUserForm title={'Ajouter un nouveau utilisateur'} isOpen={isModalOpen} onClose={closeModal} onUserCreated={handleUserCreation} />
    </div>
  );
}

export default GestionUtilisateur;
