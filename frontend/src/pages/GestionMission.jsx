import React, { useState } from 'react';
import SideBar from '../components/sideBar/SideBar';
import HeaderBis from '../components/Header/HeaderBis';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import { SquarePen } from 'lucide-react';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import HeaderWithAction from '../components/Header/HeaderWithAction';
import AddMissionForm from '../components/Forms/AddMissionForm';
import PopUp from '../components/PopUps/PopUp';
import DecisionPopUp from '../components/PopUps/DecisionPopUp';
import ExportButton from '../components/ExportButton';
import AddRisqueForm from '../components/Forms/AddRisqueForm';
import AddControleForm from '../components/Forms/AddControleForm';

function GestionMission() {
    // Colonnes de la table
    const columnsConfig2 = [
        { field: 'client', headerName: 'Client', width: 170 },
        { field: 'mission', headerName: 'Mission', width: 170 },
        { field: 'manager', headerName: 'Manager', width: 200 },
        { field: 'dateField', headerName: 'Date de début', width: 150 },
        { field: 'dateField1', headerName: 'Date fin', width: 150 },
        { field: 'statusMission', headerName: 'Status', width: 220 },
        { field: 'actions', headerName: 'Actions', width: 80 },
    ];

    // Données des missions
    const rowsData2 = [
        { id: 1, statusMission: 'en_cours', mission: 'DSP', client: 'Djeezy', manager: 'Houda Elmaouhab', dateField: '2024-11-27', dateField1: '2024-12-27' },
        { id: 2, statusMission: 'terminee', mission: 'DSP1', client: 'Oredoo', manager: 'Sara Lounes', dateField: '2024-11-27', dateField1: '2024-12-27' },
        // ... autres missions
    ];

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

    // Fonction pour récupérer le lien d'une mission
    const getRowLink = (row) => `/tablemission/${row.mission}`;

    // Mise à jour des missions après une recherche
    const handleSearchResults = (results) => setFilteredRows(results);

    // Ajout d'une nouvelle mission
    const handleMissionCreation = (newMission) => {
        setFilteredRows(prevRows => [...prevRows, { id: prevRows.length + 1, ...newMission }]);
        setIsMissionCreated(true);
        setIsModalOpen(false);
    };

    // Modification d'une mission
    const handleEditRow = (rowId) => {
        const missionToEdit = filteredRows.find(row => row.id === rowId);
        setSelectedMission(missionToEdit);
        setIsEditModalOpen(true);
    };

    // Mise à jour des missions après modification
    const handleUpdateMission = (updatedMission) => {
        setFilteredRows(prevRows => prevRows.map(row => (row.id === updatedMission.id ? updatedMission : row)));
        setIsEditModalOpen(false);
        setSelectedMission(null);
    };

    // Suppression d'une mission
    const handleDeleteRow = (rowId) => {
        setSelectedMissionId(rowId);
        setIsDeletePopupOpen(true);
    };

    // Confirmation de la suppression
    const confirmDeleteMission = () => {
        if (selectedMissionId !== null) {
            setFilteredRows(prevRows => prevRows.filter(row => row.id !== selectedMissionId));
        }
        setIsDeletePopupOpen(false);
        setSelectedMissionId(null);
    };

    // Actions sur les lignes de la table
    const rowActions = [
        { icon: <ArchiveRoundedIcon sx={{ marginRight: '5px' }} />, label: 'Archiver', onClick: handleEditRow },
        { icon: <SquarePen className='mr-2' />, label: 'Modifier', onClick: handleEditRow },
        { icon: <DeleteOutlineRoundedIcon sx={{ color: 'var(--alert-red)', marginRight: '5px' }} />, label: 'Supprimer mission', onClick: handleDeleteRow },
    ];

    return (
        <div className="flex">
            <SideBar userRole="admin" className="flex-shrink-0 h-full fixed" />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <HeaderBis />
                <HeaderWithAction title="Missions" buttonLabel="Créer une mission" onButtonClick={openModal} />
                <div className="flex items-center justify-center mb-6">
                    <SearchBar columnsConfig={columnsConfig2} initialRows={rowsData2} onSearch={handleSearchResults} />
                </div>
                <div className="flex justify-end items-center pr-10 mb-6">
                    <ExportButton rowsData={filteredRows} headers={columnsConfig2.map(col => col.headerName)} fileName="missions" />
                </div>
                <div className={`flex-1 overflow-x-auto overflow-y-auto h-[400px] transition-all ${isDeletePopupOpen ? 'blur-sm' : ''}`}>
                    <Table key={JSON.stringify(filteredRows)} columnsConfig={columnsConfig2} rowsData={filteredRows} checkboxSelection={false} getRowLink={getRowLink} headerBackground="var(--blue-nav)" rowActions={rowActions} />
                </div>
            </div>
           {/*  <AddRisqueForm
      title="Créer un nouveau risque"
      isOpen={isModalOpen}
      onClose={closeModal}
      onRisqueCreated={handleMissionCreation}
    />
     <AddControleForm
      title="Créer un nouveau risque"
      isOpen={isModalOpen}
      onClose={closeModal}
      onControleCreated={handleMissionCreation}
    />*/}
           <AddMissionForm title={'Ajouter une mission'} isOpen={isModalOpen} onClose={closeModal} onMissionCreated={handleMissionCreation} />
            {isMissionCreated &&
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
                 <PopUp text="Mission créée" redirectionURL={handlePopupClose} />
                 </div>}
            {isEditModalOpen && <AddMissionForm title={'Modifier une mission'} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} initialValues={selectedMission} onMissionCreated={handleUpdateMission} />}
            {isDeletePopupOpen && <DecisionPopUp name={filteredRows.find(row => row.id === selectedMissionId)?.mission || 'cette mission'} text="Êtes-vous sûr(e) de vouloir supprimer la mission " handleConfirm={confirmDeleteMission} handleDeny={() => setIsDeletePopupOpen(false)} />}
        </div>
    );
}

export default GestionMission;
