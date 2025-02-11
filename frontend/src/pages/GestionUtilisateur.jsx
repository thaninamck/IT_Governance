import React, { useState } from 'react';
import SideBar from '../components/sideBar/SideBar';
import HeaderBis from '../components/Header/HeaderBis';
import Table from '../components/Table';
import ToggleButton from '../components/ToggleButtons';
import SearchBar from '../components/SearchBar';
import HeaderWithAction from '../components/Header/HeaderWithAction';
import AddUserForm from '../components/Forms/AddUserForm';
import { PersonOutlineRounded, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import { SquarePen } from 'lucide-react';
import ExportButton from '../components/ExportButton';
import PopUp from '../components/PopUps/PopUp';
import DecisionPopUp from '../components/PopUps/DecisionPopUp';

function GestionUtilisateur() {

    // Configuration des colonnes de la table
  const columnsConfig2 = [
    { field: 'username', headerName: 'Nom utilisateur', width: 180, editable: false },
    { field: 'nom', headerName: 'Nom', width: 160, editable: true },
    { field: 'prenom', headerName: 'Prénom', width: 150,editable: true  },
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Options et couleurs de statut utilisateur
  const statusOptions = ["Active", "Bloqué"];
  const statusColors = { Active: 'green', Bloqué: 'red' };

// Modification d'une mission
const handleEditRow = (selectedRow) => {
  // const missionToEdit = filteredRows.find(row => row.id === rowId);
  setSelectedMission({ ...selectedRow }); // S'assurer que l'objet est bien copié
   setIsEditModalOpen(true);
   console.log("test",selectedRow)
};

// Mise à jour des missions après modification
const handleUpdateMission = (updatedMission) => {
  setFilteredRows(prevRows =>
    prevRows.map(row =>
      row.id === updatedMission.id ? { ...row, ...updatedMission } : row
    )
  );
  console.log("test",updatedMission)
  setIsEditModalOpen(false);
   setSelectedMission(null);
};

// Suppression d'une mission
const handleDeleteRow = (selectedRow) => {
   setSelectedMissionId(selectedRow.id);
   setIsDeletePopupOpen(true);
   console.log(selectedRow)
};

// Confirmation de la suppression
const confirmDeleteMission = () => {
   if (selectedMissionId !== null) {
       setFilteredRows(prevRows => prevRows.filter(row => row.id !== selectedMissionId));
   }
   setIsDeletePopupOpen(false);
   setSelectedMissionId(null);
};

const rowActions = [
  { icon: <PersonOutlineRounded sx={{ marginRight: "8px" }} />, label: "Voir Profile", onClick: handleEditRow },
  { icon: <SquarePen className='mr-2' />, label: "Modifier", onClick: (selectedRow) => handleEditRow(selectedRow) },
  { icon: <ErrorOutlineIcon style={{ color: 'var(--alert-red)', marginRight: "8px" }} />, label: "Supprimer utilisateur", onClick: (selectedRow) => handleDeleteRow(selectedRow) },
];


  // Gestion de la recherche d'utilisateur
  const handleSearchResults = (results) => setFilteredRows(results);

  // Gestion de l'ajout d'un nouvel utilisateur
  const handleUserCreation = (newUser) => {
    setFilteredRows(prevRows => [...prevRows, { id: prevRows.length + 1, ...newUser }]);
    setIsModalOpen(false);
  };

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
        </div>
        <div className='border border-black mb-28 ml-20'>
        <ToggleButton/>
        </div>
      </div>


      {/* Modal d'ajout d'un utilisateur */}
      <AddUserForm title={'Ajouter un nouveau utilisateur'} isOpen={isModalOpen} onClose={closeModal} onUserCreated={handleUserCreation} />
     
            {isEditModalOpen && <AddUserForm title={'Modifier un utilisateur'} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} initialValues={selectedMission || {}} onUserCreated={handleUpdateMission} />}
            {isDeletePopupOpen && <DecisionPopUp name={filteredRows.find(row => row.id === selectedMissionId)?.username || 'ce utilisateur'} text="Êtes-vous sûr(e) de vouloir supprimer l'utilisateur " handleConfirm={confirmDeleteMission} handleDeny={() => setIsDeletePopupOpen(false)} />}
        
      
    </div>
  );
}

export default GestionUtilisateur;
