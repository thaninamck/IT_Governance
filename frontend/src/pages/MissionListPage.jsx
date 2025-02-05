import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/sideBar/SideBar';
import HeaderBis from '../components/Header/HeaderBis';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';

function MissionListPage() {
   
    const columnsConfig2 = [
  
        { field: 'statusMission', headerName: 'Status', width: 250 },
        { field: 'mission', headerName: 'Mission', width: 220 },
        { field: 'client', headerName: 'Client', width: 220 },
        { field: 'role', headerName: 'Role', width: 220 },
        { field: 'actions', headerName: 'Actions', width: 80 },
      ];
      
      const rowsData2 = [
        { id: 1, statusMission: 'en_cours', mission: 'DSP', client: 'Djeezy', role: 'Manager' },
        { id: 2, statusMission: 'terminee', mission: 'DSP1', client: 'Oredoo', role: 'Testeur' },
        { id: 3, statusMission: 'non_commencee', mission: 'DSP2', client: 'Mazars', role: 'Testeur' },
        { id: 4, statusMission: 'en_retard', mission: 'DSP3', client: 'Djeezy', role: 'Superviseur' },
        { id: 5, statusMission: 'non_commencee', mission: 'DSP3', client: 'Djeezy', role: 'Superviseur' },
        { id: 6, statusMission: 'en_retard', mission: 'DSP3', client:  'Mazars', role: 'Superviseur' },
        { id: 7, statusMission: 'non_commencee', mission: 'DSP3', client: 'Djeezy', role: 'Superviseur' },
        { id: 8, statusMission: 'en_retard', mission: 'DSP3', client:  'Mazars', role: 'Superviseur' },
        { id: 9, statusMission: 'en_cours', mission: 'DSP3', client: 'Djeezy', role: 'Superviseur' },
        { id: 10, statusMission: 'en_retard', mission: 'DSP3', client: 'Djeezy', role: 'Superviseur' },
        { id: 11, statusMission: 'terminee', mission: 'DSP3', client: 'Oredoo', role: 'Superviseur' },
        { id: 12, statusMission: 'en_cours', mission: 'DSP3', client: 'Djeezy', role: 'Superviseur' },
        { id: 13, statusMission: 'en_retard', mission: 'DSP3', client: 'Oredoo', role: 'Superviseur' },
        // Ajoute d'autres lignes avec des ids uniques
      ];
      const getRowLink = (row) => `/tablemission/${row.mission}`;

      const [filteredRows, setFilteredRows] = useState(rowsData2);
      const handleSearchResults = (results) => {
          setFilteredRows(results);
        };
  return (
    <div className="flex ">
    {/* Barre latérale fixe */}
    <SideBar userRole="admin" className=" flex-shrink-0 h-full fixed" />

    {/* Contenu principal défilable */}
    <div className=" flex-1 flex flex-col h-screen overflow-y-auto">
      {/* En-tête */}
      
      <HeaderBis />
      <h1 className="text-3xl p-8  ">Mes missions</h1>
      <div className="flex items-center justify-center mb-9">
      <SearchBar
      columnsConfig={columnsConfig2}
      initialRows={rowsData2}
      onSearch={handleSearchResults} // Mettez à jour ici pour utiliser la fonction appropriée
       />
       </div>

      <div className="flex items-center">
      
      <Table key={filteredRows.length} 
       columnsConfig={columnsConfig2} 
        rowsData={filteredRows}  
         checkboxSelection={false} 
         getRowLink={getRowLink} />
     </div>
     </div>
  </div>
  )
}

export default MissionListPage