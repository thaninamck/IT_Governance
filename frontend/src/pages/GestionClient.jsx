// src/components/GestionClient.js
import React, { useContext } from 'react';
import SideBar from '../components/sideBar/SideBar';
import HeaderBis from '../components/Header/HeaderBis';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import { SquarePen } from 'lucide-react';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import HeaderWithAction from '../components/Header/HeaderWithAction';
import AddClientForm from '../components/Forms/AddClientForm';
import DecisionPopUp from '../components/PopUps/DecisionPopUp';
import ExportButton from '../components/ExportButton';
import { PermissionRoleContext } from '../Context/permissionRoleContext';
import useClient from '../Hooks/useClient';
import { useAuth } from '../Context/AuthContext';


function GestionClient() {
    const { user} = useAuth();
    // Configuration des colonnes pour la table
    const columnsConfig = [
        { field: 'commercialName', headerName: 'Nom', width: 250 },
        { field: 'socialReason', headerName: 'Raison Social', width: 220 },
        { field: 'correspondence', headerName: 'Secteur', width: 250, expandable: true, maxInitialLength: 20 },
        { field: 'address', headerName: 'Email', width: 250, expandable: true, maxInitialLength: 20 },
        { field: 'contact1', headerName: 'Contact 1', width: 150 },
        { field: 'contact2', headerName: 'Contact 2', width: 150 },
        { field: 'actions', headerName: 'Actions', width: 80 },
    ];

    // Utiliser le hook useClients pour gérer la logique des clients
    const {
        filtereRows,
        setFiltereRows,
        isModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        selectedClient,
        isDeletePopupOpen,
        selectedClientId,
        openModal,
        closeModal,
        handleClientCreation,
        handleEditRow,
        handleUpdateClient,
        handleDeleteRow,
        confirmDeleteClient,
        closeDeletePopup,
    } = useClient();

    // Accédez à userRole et setUserRole via le contexte
   // const { userRole } = useContext(PermissionRoleContext);

    // Actions pour la table
    const rowActions = [
        { icon: <SquarePen className='mr-2' />, label: "Modifier", onClick: (selectedRow) => { handleEditRow(selectedRow) } },
        { icon: <DeleteOutlineRoundedIcon sx={{ color: 'var(--alert-red)', marginRight: "5px" }} />, label: "Supprimer", onClick: (selectedRow) => { handleDeleteRow(selectedRow) } },
    ];

    // Nom du fichier d'exportation
    const fileName = `List_Clients_${new Date().getMonth() + 1}_${new Date().getFullYear()}`;

    return (
        <div className="flex">
            {/* Barre latérale */}
            <SideBar user={user} className="flex-shrink-0 h-full fixed" />

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <HeaderBis />
                <HeaderWithAction title="Client" buttonLabel="Créer un Client" onButtonClick={openModal} user={user} />

                {/* Barre de recherche */}
                <div className="flex items-center justify-center mb-6">
                    <SearchBar columnsConfig={columnsConfig} initialRows={filtereRows} onSearch={setFiltereRows} />
                </div>

                {/* Bouton d'exportation */}
                <div className="flex justify-end items-center pr-10 mb-6">
                    {/* <ExportButton rowsData={filtereRows} headers={columnsConfig.map(col => col.headerName)} fileName={fileName} /> */}
                    <ExportButton
  rowsData={filtereRows}
  columns={columnsConfig}
  fileName={fileName}
/>
                </div>

                {/* Tableau des clients */}
                <div className={`flex-1 overflow-x-auto overflow-y-auto h-[400px] transition-all ${isDeletePopupOpen ? 'blur-sm' : ''}`}>
                    <Table key={JSON.stringify(filtereRows)} columnsConfig={columnsConfig} rowsData={filtereRows} checkboxSelection={false} headerBackground="var(--blue-nav)" rowActions={rowActions} />
                </div>
            </div>

            {/* Modals */}
            <AddClientForm title={'Ajouter un Client'} isOpen={isModalOpen} onClose={closeModal} onClientCreated={handleClientCreation} />
            {isEditModalOpen && <AddClientForm title={'Modifier un client'} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} initialValues={selectedClient} onClientCreated={handleUpdateClient} />}
            {isDeletePopupOpen && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1"><DecisionPopUp name={filtereRows.find(row => row.id === selectedClientId)?.commercialName || 'ce client'} text="Êtes-vous sûr(e) de vouloir supprimer le client ?" handleConfirm={confirmDeleteClient} handleDeny={closeDeletePopup} /></div>}
        </div>
    );
}

export default GestionClient;