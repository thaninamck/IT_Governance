import { Tab } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Table from '../../components/Table';
import ExportButton from '../../components/ExportButton';
import api from '../../Api';

function Logs() {
    // Configuration des colonnes de la table
  // const columnslogs = [
  //   { field: 'dateField', headerName: 'Date_Heure', width: 180, editable: false },
  //   { field: 'utilisateur', headerName: 'utilisateur', width: 160, editable: true },
  //   { field: 'macAddress', headerName: 'Mac address', width: 150 },
  //   { field: 'profile', headerName: 'Profile', width: 180 },
  //   { field: 'event', headerName: 'Action', width: 260, expandable: true, maxInitialLength: 20 },
  //   { field: 'mission', headerName: 'Mission', width: 120 },
  // ];
  const [logs, setLogs] = useState([]);
  const columnslogs = [
    { field: 'date_heure', headerName: 'Date_Heure', width: 180 },
    { field: 'utilisateur', headerName: 'Utilisateur', width: 160 },
    { field: 'ip', headerName: 'ip Address', width: 150 },
    { field: 'mac', headerName: 'Mac Address', width: 150 },
    { field: 'profile', headerName: 'Profile', width: 180 },
    { field: 'action', headerName: 'Action', width: 260, expandable: true },
    { field: 'mission', headerName: 'Mission', width: 120 },
  ];
   // Fonction pour récupérer les logs depuis l'API
   const fetchLogs = async () => {
    try {
      const response = await api.get('/logs'); // Appel API
      console.log(response.data)
      setLogs(response.data); // Stockage des logs
       setFilteredRows(response.data); // Remplissage des données affichées
//       const fetchedLogs = response.data?.data || [];
// setLogs(fetchedLogs); 
// setFilteredRows(fetchedLogs);

    } catch (error) {
      console.error('Erreur lors de la récupération des logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Données initiales des utilisateurs
  const rowslogs = [
    // { id: 1, dateField: '2024-12-23', utilisateur: 'houda.elmaouhab', macAddress: 'A3:FF:43:87', profile: 'manager', event: 'Clôture de la mission', mission: 'DSP'},
    // { id: 2, dateField: '2024-11-3', utilisateur: 'sara.lounes', macAddress: 'A3:AF:53:87', profile: 'superviseur', event: 'valider mission', mission: 'DSP1'},
    // { id: 3, dateField: '2024-1-13', utilisateur: 'houda.elmaouhab', macAddress: 'A3:FF:43:87', profile: 'Testeur', event: 'Submit controle', mission: 'DSP3'},
  ];
  const [filteredRows, setFilteredRows] = useState(rowslogs);
  return (
    <div  className='p-2'>
        <h2 className="text-xl font-bold mb-4">Historique des journaux</h2>
       
         {/* Bouton d'exportation */}
         <div className="flex justify-end items-center pr-10 mb-6">
          <ExportButton rowsData={filteredRows} headers={columnslogs.map(col => col.headerName)} fileName={`Logs_${new Date().getMonth() + 1}_${new Date().getFullYear()}`} />
        </div>
        <div className="flex-1 mt-6 overflow-x-auto overflow-y-auto h-[500px]">
          <Table
            // key={filteredRows.length}
            key={filteredRows?.length || 0}

            columnsConfig={columnslogs}
            rowsData={filteredRows}
            checkboxSelection={false}
            headerBackground="var(--blue-nav)"
        
          />
        </div>

    </div>
  )
}

export default Logs