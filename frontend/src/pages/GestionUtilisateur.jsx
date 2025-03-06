import React, { useContext, useState } from 'react';
import SideBar from '../components/sideBar/SideBar';
import HeaderBis from '../components/Header/HeaderBis';
import Table from '../components/Table';

import SearchBar from '../components/SearchBar';
import HeaderWithAction from '../components/Header/HeaderWithAction';
import AddUserForm from '../components/Forms/AddUserForm';
import { PersonOutlineRounded, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import { SquarePen } from 'lucide-react';
import ExportButton from '../components/ExportButton';
import PopUp from '../components/PopUps/PopUp';
import DecisionPopUp from '../components/PopUps/DecisionPopUp';
import emailjs from 'emailjs-com';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { PermissionRoleContext } from '../Context/permissionRoleContext';
import { Snackbar } from '@mui/material';

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
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [ResetShow, setResetShow] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success", "error", "warning", "info"

   // Accédez à userRole et setUserRole via le contexte
   const { userRole, setUserRole } = useContext(PermissionRoleContext);
  
   // Utilisez userRole dans votre composant
   console.log("Rôle de l'utilisateur :", userRole);
  

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Options et couleurs de statut utilisateur
  const statusOptions = ["Active", "Bloqué"];
  const statusColors = { Active: 'green', Bloqué: 'red' };

// Modification d'une mission
const handleEditRow = (selectedRow) => {
  // const missionToEdit = filteredRows.find(row => row.id === rowId);
  setSelectedApp({ ...selectedRow }); // S'assurer que l'objet est bien copié
   setIsEditModalOpen(true);
   console.log("test",selectedRow)
};

// Mise à jour des missions après modification
const handleUpdateApp = (updatedApp) => {
  setFilteredRows(prevRows =>
    prevRows.map(row =>
      row.id === updatedApp.id ? { ...row, ...updatedApp } : row
    )
  );
  console.log("test",updatedApp)
  setIsEditModalOpen(false);
   setSelectedApp(null);
};

// Suppression d'une mission
const handleDeleteRow = (selectedRow) => {
   setSelectedAppId(selectedRow.id);
   setIsDeletePopupOpen(true);
   console.log(selectedRow)
};

// Confirmation de la suppression
const confirmDeleteApp = () => {
   if (selectedAppId !== null) {
       setFilteredRows(prevRows => prevRows.filter(row => row.id !== selectedAppId));
   }
   setIsDeletePopupOpen(false);
   setSelectedAppId(null);
};

const generateRandomPassword = () => {
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

const handleResetRow =  (selectedRow) => {
  setSelectedAppId(selectedRow.id);
   setResetShow(true);
   console.log(selectedRow)
  }

  const handleResetConfirm = async () => {
    if (selectedAppId !== null) {
      const selectedUser = filteredRows.find((row) => row.id === selectedAppId);
      if (!selectedUser) return;
  
      const newPassword = generateRandomPassword();
      const userEmail = selectedUser.email;
  
      try {
        await emailjs.send(
          'service_ft79mie',
          'template_f4ojiam',
          { to_email: userEmail, new_password: newPassword },
          'oAXuwpg74dQwm0C_s'
        );
  
        setFilteredRows(prevRows =>
          prevRows.map(row =>
            row.id === selectedAppId ? { ...row, password: newPassword } : row
          )
        );

      setSnackbarMessage("Un nouveau mot de passe a été envoyé à l'adresse email.");
      setSnackbarSeverity("success");
  
       // alert('Un nouveau mot de passe a été envoyé à l\'adresse email.');
        
       // setTimeout(() => setSelectedAppId(null), 500); // Évite d'effacer trop tôt
  
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
       // alert('Une erreur est survenue.');
       setSnackbarMessage("Une erreur est survenue lors de l'envoi de l'email.");
      setSnackbarSeverity("error");
      }
  
      setSnackbarOpen(true);
      setResetShow(false);
      setSelectedAppId(null);
    }
  };
  
const rowActions = [
  { icon: <PersonOutlineRounded sx={{ marginRight: "8px" }} />, label: "Voir Profile", onClick: handleEditRow },
  { icon: <SquarePen className='mr-2' />, label: "Modifier", onClick: (selectedRow) => handleEditRow(selectedRow) },
  { 
    icon: <RestartAltIcon className='mr-2' />, 
    label: "Réinitialiser", 
    onClick: (selectedRow) => { 
     
        handleResetRow(selectedRow); 
      
    },
    disabled: (selectedRow) =>{
      return(
        !selectedRow||!["Active"].includes(selectedRow.status)
      )
    } 
  },
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
      <SideBar userRole={userRole} className="flex-shrink-0 h-full fixed" />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <HeaderBis />
        <HeaderWithAction title="Utilisateurs" buttonLabel="Ajouter un utilisateur" onButtonClick={openModal} userRole={userRole} />

        {/* Barre de recherche */}
        <div className="flex justify-center mb-6">
          <SearchBar columnsConfig={columnsConfig2} initialRows={rowsData2} onSearch={handleSearchResults} />
        </div>

        {/* Bouton d'exportation */}
        <div className="flex justify-end items-center pr-10 mb-6">
          <ExportButton rowsData={filteredRows} headers={columnsConfig2.map(col => col.headerName)} fileName={`List_Utilisateurs_${new Date().getMonth() + 1}_${new Date().getFullYear()}`} />
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
        <div className={`flex-1 overflow-x-auto overflow-y-auto h-[400px]  ${isDeletePopupOpen ? 'blur-sm' : ''}`}>
       
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
        
      </div>


      {/* Modal d'ajout d'un utilisateur */}
      <AddUserForm title={'Ajouter un nouveau utilisateur'} isOpen={isModalOpen} onClose={closeModal} onUserCreated={handleUserCreation} />
     
            {isEditModalOpen && <AddUserForm title={'Modifier un utilisateur'} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} initialValues={selectedApp || {}} onUserCreated={handleUpdateApp} />}
            {isDeletePopupOpen &&  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1"> <DecisionPopUp name={filteredRows.find(row => row.id === selectedAppId)?.username || 'ce utilisateur'} text="Êtes-vous sûr(e) de vouloir supprimer l'utilisateur " handleConfirm={confirmDeleteApp} handleDeny={() => setIsDeletePopupOpen(false)} /> </div>}
            {ResetShow &&  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1"> <DecisionPopUp name={filteredRows.find(row => row.id === selectedAppId)?.username || 'ce utilisateur'} text="Êtes-vous sûr(e) de vouloir réinisialiser le mot de passe " handleConfirm={handleResetConfirm } handleDeny={() => setResetShow(false)} /> </div>}
            

      
    </div>
  );
}

export default GestionUtilisateur;
