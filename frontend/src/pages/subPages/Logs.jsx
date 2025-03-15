import React, { useEffect, useState } from 'react'
import Table from '../../components/Table';
import ExportButton from '../../components/ExportButton';
import api from '../../Api';
import useSettings from '../../Hooks/useSettings';

function Logs() {

  const columnslogs = [
    { field: 'date_heure', headerName: 'Date_Heure', width: 180 },
    { field: 'utilisateur', headerName: 'Utilisateur', width: 160 },
    { field: 'ip', headerName: 'ip Address', width: 150 },
    { field: 'mac', headerName: 'Mac Address', width: 150 },
    { field: 'profile', headerName: 'Profile', width: 180 },
    { field: 'action', headerName: 'Action', width: 260, expandable: true },
    { field: 'mission', headerName: 'Mission', width: 120 },
  ];
  // Utiliser useSettings pour gérer les logs
  const { logs, filteredLogs, fetchLogs } = useSettings({
    fetchEndpoint: '/logs', // Endpoint pour les logs
    createEndpoint: '', // Pas nécessaire pour les logs
    deleteEndpoint: '', // Pas nécessaire pour les logs
    labelKey: 'name', // Pas nécessaire pour les logs
    itemKey: 'id', // Pas nécessaire pour les logs
    onAdd: () => { }, // Pas nécessaire pour les logs
  });

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);


  return (
    <div className='p-2'>
      <h2 className="text-xl font-bold mb-4">Historique des journaux</h2>
      <div className="flex justify-end items-center pr-10 mb-6">
        <ExportButton rowsData={filteredLogs} headers={columnslogs.map(col => col.headerName)} fileName={`Logs_${new Date().getMonth() + 1}_${new Date().getFullYear()}`} />
      </div>
      <div className="flex-1 mt-6 overflow-x-auto overflow-y-auto h-[500px]">
        <Table
          key={filteredLogs?.length || 0}
          columnsConfig={columnslogs}
          rowsData={filteredLogs}
          checkboxSelection={false}
          headerBackground="var(--blue-nav)"

        />
      </div>

    </div>
  )
}

export default Logs