import React, { useState } from 'react'
import SideBar from '../components/sideBar/SideBar';
import HeaderBis from '../components/Header/HeaderBis';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import HeaderWithAction from '../components/Header/HeaderWithAction';
import AddUserForm from '../components/Forms/AddUserForm';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { SquarePen} from 'lucide-react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


function GestionUtilisateur() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false); 

    const statusOptions = ["Active", "Bloqué"];
const statusColors = {
    Active: 'green',
    Bloqué: 'red',
};

  const columnsConfig2 = [
    { field: 'username', headerName: 'Nom utilisateur', width: 180 ,editable: false },
    { field: 'nom', headerName: 'Nom', width: 160 ,editable: true },
    { field: 'prenom', headerName: 'Prénom', width: 150 },
    { field: 'grade', headerName: 'Grade', width: 180 },
    { field: 'email', headerName: 'Email', width: 260 ,expandable: true,maxInitialLength: 20},
    { field: 'contact', headerName: 'Contact', width: 120 },
    { field: 'dateField', headerName: 'Dernière Activité', width: 150 },
    { field: 'dateField1', headerName: "Date d'ajout", width: 130 },
    { field: 'status', headerName: 'Status', width: 140 },
    { field: 'actions', headerName: 'Actions', width: 80 },
  ];

  const rowsData2 = [
    {
      id: 1,
      username: 'manel.mohandouali',
      nom: 'Mohand Ouali',
      prenom: 'Manel',
      grade: 'Stagiaire',
      email: 'manel.mohandouali@mazars.dz manel.mohandouali@mazars.dz manel.mohandouali@mazars.dz manel.mohandouali@mazars.dz',
      contact: '0659195905',
      dateField: '2024-12-27T00:00:00',
      dateField1: '2024-12-27T00:00:00',
      status: 'Active',
    },
    {id: 2,username: 'thanina.mecherak',nom: 'Mecherak',prenom: 'Thanina',grade: 'Stagiaire',email: 'thanina.mecherak@mazars.dz',contact: '0659195905',dateField: '2024-12-27T00:00:00',dateField1: '2024-12-27T00:00:00Z',status: 'Active',},
    {id: 3,username: 'azyadi.zouaghi',nom: 'Zouaghi',prenom: 'Azyadi',grade: 'Junior 2',email: 'azyadi.zouaghi@mazars.dz',contact: '0659195905',dateField: 'DEC 27,2024',dateField1: 'SEP 07,2023',status: 'Active',},
    {id: 4,username: 'kamelia.toubal',nom: 'Kamelia',prenom: 'Toubal',grade: 'Junior 1',email: 'kamelia.Toubal@mazars.dz',contact: '0659195905',dateField: 'DEC 27,2024',dateField1: 'SEP 07,2023',status: 'Active',},
    {id: 5,username: 'seifali.hafri',nom: 'Hafri',prenom: 'Seif Ali',grade: 'Junior 2',email: 'seifali.hafri@mazars.dz',contact: '0659195905',dateField: 'DEC 27,2024',dateField1: 'SEP 07,2023',status: 'Active',},
    {id: 6,username: 'houda.elmaouhab',nom: 'Elmaouhab',prenom: 'Houda',grade: 'Assistent Manager',email: 'houda.elmaouhab@mazars.dz',contact: '0659195905',dateField: 'DEC 27,2024',dateField1: 'SEP 07,2023',status: 'Active',},
    {id: 7,username: 'sara.lounes',nom: 'Lounes',prenom: 'Sara',grade: 'Senior 1',email: 'sara.lounes@mazars.dz',contact: '0659195905',dateField: 'DEC 27,2024',dateField1: 'SEP 07,2023',status: 'Active',},
    {id: 8,username: 'sara.lounes',nom: 'Lounes',prenom: 'Sara',grade: 'Senior 1',email: 'sara.lounes@mazars.dz',contact: '0659195905',dateField: 'DEC 27,2024',dateField1: 'SEP 07,2023',status: 'Active',},
    {id: 9,username: 'sara.lounes',nom: 'Lounes',prenom: 'Sara',grade: 'Senior 1',email: 'sara.lounes@mazars.dz',contact: '0659195905',dateField: 'DEC 27,2024',dateField1: 'SEP 07,2023',status: 'Active',},
    {id: 10,username: 'sara.lounes',nom: 'Lounes',prenom: 'Sara',grade: 'Senior 1',email: 'sara.lounes@mazars.dz',contact: '0659195905',dateField: 'DEC 27,2024',dateField1: 'SEP 07,2023',status: 'Active',},
    {id: 11,username: 'sara.lounes',nom: 'Lounes',prenom: 'Sara',grade: 'Senior 1',email: 'sara.lounes@mazars.dz',contact: '0659195905',dateField: 'DEC 27,2024',dateField1: 'SEP 07,2023',status: 'Active',},
    {id: 12,username: 'sara.lounes',nom: 'Lounes',prenom: 'Sara',grade: 'Senior 1',email: 'sara.lounes@mazars.dz',contact: '0659195905',dateField: 'DEC 27,2024',dateField1: 'SEP 07,2023',status: 'Active',},
    
    // Ajoute d'autres lignes avec des ids uniques
  ];
   // Définir les fonctions d'action
   const handleEditRow = (rowId) => {
    console.log("Edit Row clicked for row with ID:", rowId);
    // Logique pour modifier la ligne
};

const handleDeleteRow = (rowId) => {
    console.log("Delete Row clicked for row with ID:", rowId);
    // Logique pour supprimer la ligne
};

const handleHideRow = (rowId) => {
    console.log("Hide Row clicked for row with ID:", rowId);
    // Logique pour masquer la ligne
};

const rowActions = [
    { icon: <PersonOutlineRoundedIcon sx={{marginRight:"5px"}}/> ,label: "Voir Profile", onClick: handleEditRow },
    { icon:<SquarePen className='mr-2' />,label: "Modifier", onClick: handleDeleteRow },
    {icon:<ErrorOutlineIcon sx={{color:'var(--alert-red)',marginRight:"5px"}}/>, label: "Supprimer utilisateur", onClick: handleHideRow },
];
  
  const [filteredRows, setFilteredRows] = useState(rowsData2);
  const handleSearchResults = (results) => {
    setFilteredRows(results);
  };

  return (
    <div className="flex">
      {/* Barre latérale fixe */}
      <SideBar userRole="admin" className="flex-shrink-0 h-full fixed" />

      {/* Contenu principal défilable */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* En-tête */}
        <HeaderBis />
        <HeaderWithAction
          title="Utilisateurs"
          buttonLabel="Ajouter un utilisateur"
           onButtonClick={openModal} // Ouvrir le modal au clic
        />

        {/* Barre de recherche */}
        <div className="flex items-center justify-center mb-6">
          <SearchBar
            columnsConfig={columnsConfig2}
            initialRows={rowsData2}
            onSearch={handleSearchResults}
          />
        </div>

        {/* Table avec scroll */}
        <div className="flex-1 overflow-x-auto overflow-y-auto h-[400px] border rounded-md">
          <Table
            key={filteredRows.length}
            columnsConfig={columnsConfig2}
            rowsData={filteredRows}
            checkboxSelection={false}
            headerBackground = "var(--blue-nav)"
            statusOptions={statusOptions}
            statusColors={statusColors}
            rowActions={rowActions}

           
          />
        </div>
      </div>
       {/* Affichage du modal */}
       <AddUserForm title={'Ajouter un nouveau utilisateur'} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default GestionUtilisateur;
