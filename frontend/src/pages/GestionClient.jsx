import React, { useContext, useState } from 'react';
import SideBar from '../components/sideBar/SideBar';
import HeaderBis from '../components/Header/HeaderBis';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import { SquarePen } from 'lucide-react';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import HeaderWithAction from '../components/Header/HeaderWithAction';
import AddClientForm from '../components/Forms/AddClientForm';
import PopUp from '../components/PopUps/PopUp';
import DecisionPopUp from '../components/PopUps/DecisionPopUp';
import ExportButton from '../components/ExportButton';
import { PermissionRoleContext } from '../Context/permissionRoleContext';

function GestionClient() {
    // Configuration des colonnes pour la table
    const columnsConfig = [
        { field: 'nom', headerName: 'Nom', width: 170 },
        { field: 'raisonSocial', headerName: 'Raison Social', width: 220 },
        { field: 'secteur', headerName: 'Secteur', width: 220 },
        { field: 'email', headerName: 'Email', width: 180 },
        { field: 'dateField', headerName: 'Date de création', width: 140 },
        { field: 'contact1', headerName: 'Contact 1', width: 110 },
        { field: 'contact2', headerName: 'Contact 2', width: 110 },
        { field: 'actions', headerName: 'Actions', width: 80 },
    ];

    // Données initiales des clients
    const rowsData2 = [
        { id: 1, nom: 'Djeezy', raisonSocial: 'Optimum Télécom Algérie', secteur: 'Télécommunications', email: 'contact@djezzy.dz', dateField: '2024-11-27', contact1: '0561616622', contact2: '0561616622' },
        { id: 2, nom: 'Algérie Télécom', raisonSocial: 'Optimum Télécom Algérie', secteur: 'Télécommunications', email: 'contact@at.dz', dateField: '2024-11-27', contact1: '0561616633', contact2: '0561616644' },
    ];
    // État pour la gestion des clients
    const [filteredRows, setFilteredRows] = useState(rowsData2);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);

    
      // Accédez à userRole et setUserRole via le contexte
         const { userRole, setUserRole } = useContext(PermissionRoleContext);
        
         // Utilisez userRole dans votre composant
         console.log("Rôle de l'utilisateur :", userRole);

    // Fonction pour ouvrir le modal d'ajout
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Ajout d'un client
    const handleClientCreation = (newClient) => {
        setFilteredRows(prevRows => [
            ...prevRows,
            { id: prevRows.length + 1, ...newClient, dateField: new Date().toISOString().split('T')[0] }
        ]);
        setIsModalOpen(false);
    };

    // Modification d'un client
    const handleEditRow = (selectedRow) => {
        console.log(selectedRow)
        setSelectedClient(selectedRow);
        setIsEditModalOpen(true);
    };

    const handleUpdateClient = (updatedClient) => {
        setFilteredRows(prevRows => prevRows.map(row => (row.id === updatedClient.id ? { ...updatedClient } : row)));
        setIsEditModalOpen(false);
        setSelectedClient(null);
    };

    // Suppression d'un client avec confirmation
    const handleDeleteRow = (selectedRow) => {
        setSelectedClientId(selectedRow.id);
        setIsDeletePopupOpen(true);
        console.log(selectedRow)
    };

    const confirmDeleteClient = () => {
        if (selectedClientId !== null) {
            setFilteredRows(prevRows => prevRows.filter(row => row.id !== selectedClientId));
        }
        setIsDeletePopupOpen(false);
        setSelectedClientId(null);
    };

    const closeDeletePopup = () => {
        setIsDeletePopupOpen(false);
        setSelectedClientId(null);
    };

    // Actions pour la table
    const rowActions = [
        { icon: <SquarePen className='mr-2' />, label: "Modifier", onClick:(selectedRow)=>{handleEditRow(selectedRow)} },
        { icon: <DeleteOutlineRoundedIcon sx={{ color: 'var(--alert-red)', marginRight: "5px" }} />, label: "Supprimer", onClick:(selectedRow)=>{ handleDeleteRow(selectedRow)} },
    ];

    // Nom du fichier d'exportation
    const fileName = `List_Clients_${new Date().getMonth() + 1}_${new Date().getFullYear()}`;

    return (
        <div className="flex">
            {/* Barre latérale */}
            <SideBar userRole={userRole} className="flex-shrink-0 h-full fixed" />

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <HeaderBis />
                <HeaderWithAction title="Client" buttonLabel="Créer un Client" onButtonClick={openModal} userRole={userRole} />
                
                {/* Barre de recherche */}
                <div className="flex items-center justify-center mb-6">
                    <SearchBar columnsConfig={columnsConfig} initialRows={rowsData2} onSearch={setFilteredRows} />
                </div>
                
                {/* Bouton d'exportation */}
                <div className="flex justify-end items-center pr-10 mb-6">
                    <ExportButton rowsData={filteredRows} headers={columnsConfig.map(col => col.headerName)} fileName={fileName} />
                </div>
                
                {/* Tableau des clients */}
                <div className={`flex-1 overflow-x-auto overflow-y-auto h-[400px] transition-all ${isDeletePopupOpen ? 'blur-sm' : ''}`}>
                    <Table key={JSON.stringify(filteredRows)} columnsConfig={columnsConfig} rowsData={filteredRows} checkboxSelection={false} headerBackground="var(--blue-nav)" rowActions={rowActions} />
                </div>
            </div>
            
            {/* Modals */}
            <AddClientForm title={'Ajouter un Client'} isOpen={isModalOpen} onClose={closeModal} onClientCreated={handleClientCreation} />
            {isEditModalOpen && <AddClientForm title={'Modifier un client'} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} initialValues={selectedClient} onClientCreated={handleUpdateClient} />}
            {isDeletePopupOpen && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1"><DecisionPopUp name={filteredRows.find(row => row.id === selectedClientId)?.nom || 'ce client'} text="Êtes-vous sûr(e) de vouloir supprimer le client ?" handleConfirm={confirmDeleteClient} handleDeny={closeDeletePopup} /></div>}
        </div>
    );
}

export default GestionClient;