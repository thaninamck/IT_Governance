import React, { useEffect, useState } from 'react'
import Table from '../../components/Table';
import ExportButton from '../../components/ExportButton';

import useSettings from '../../Hooks/useSettings';
import Spinner from '../../components/Spinner';

function Logs() {

  const columnslogs = [
    { field: 'date_heure', headerName: 'Date_Heure', width: 180 },
    { field: 'utilisateur', headerName: 'Utilisateur', width: 160 },
    { field: 'ip', headerName: 'Addresse IP', width: 150 },
    { field: 'profile', headerName: 'Profil', width: 180 },
    { field: 'action', headerName: 'Action', width: 260, expandable: true },
    { field: 'mission', headerName: 'Mission', width: 120 },
  ];
  
  // Utiliser useSettings pour gérer les logs
  const { loading,logs, filteredLogs, fetchLogs } = useSettings({
    fetchEndpoint: '/logs', // Endpoint pour les logs
    createEndpoint: '', // Pas nécessaire pour les logs
    deleteEndpoint: '', // Pas nécessaire pour les logs
    labelKey: 'name', // Pas nécessaire pour les logs
    itemKey: 'id', // Pas nécessaire pour les logs
    onAdd: () => { }, // Pas nécessaire pour les logs
  });

  useEffect(() => {
    fetchLogs();
  }, []);

//console.log("filtredlog",filteredLogs)
  return (
    <div className='p-2'>
      <h2 className="text-xl font-bold mb-4">Historique des journaux</h2>
      <div className="flex justify-end items-center pr-10 mb-6">
      <ExportButton
  rowsData={filteredLogs}
  columns={columnslogs}
  fileName={`Logs_${
    new Date().getMonth() + 1
  }_${new Date().getFullYear()}`}
/>
       
      </div>
      {loading ? (
                    <div className="flex items-center justify-center mt-9 w-full h-full">
                      <Spinner color="var(--blue-menu)" />
                    </div>
                  ) :(
      <div className="flex-1 mt-6 overflow-x-auto overflow-y-auto h-[500px]">
        <Table
        //  key={filteredLogs?.length || 0}
          key={JSON.stringify(filteredLogs)}
          columnsConfig={columnslogs}
          rowsData={filteredLogs}
          checkboxSelection={false}
         headerTextBackground={"white"}
              headerBackground="var(--blue-menu)"

        />
      </div>)}

    </div>
  )
}

export default Logs