
import React, { useEffect, useState } from 'react'
import Table from '../Table'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircularProgressbarComponent from './CircularProgressbarComponent';
import { api } from '../../Api';
import { useDashboard } from '../../Hooks/useDashboard';

function RemediationActionData({ data, getColor }) {
  const {
    fetchControlActionData,
    controlActionData,
    controlActionLoading
  } = useDashboard();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const columnsConfig2 = [

    { field: "action_name", headerName: "Action", width: 200, expandable: true },
    { field: "description", headerName: "Description", width: 300, expandable: true },
    { field: "owner_cntct", headerName: "Owner", width: 230, expandable: true },
    { field: "follow_up", headerName: "Suivi", width: 270, expandable: true },
    { field: "status_name", headerName: "Status", width: 100, expandable: true },
  ]

  const toggleDropdown = (executionId) => {
    setOpenDropdowns((prev) => {
      const isOpen = !prev[executionId];
      if (isOpen && !controlActionData[executionId]) {
        fetchControlActionData(data.mission_id, executionId);
      }
      
      return {
        ...prev,
        [executionId]: isOpen,
      };
    });
  };
  return (
    <div className='px-4 sm:px-8 lg:px-16 pb-4 mb-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4'>
        {data.executions?.map((item) => (
          <div key={item.execution_id} className='flex flex-col px-4'>
            <div onClick={() => toggleDropdown(item.execution_id)}  className={`border border-black cursor-pointer border-l-4 border-l-orange-600 flex justify-between items-center py-2 lg:px-4 gap-4  sm:pl-0 rounded shadow-sm hover:shadow-md transition duration-200 ${getColor(item.nom)}`}>
              <p className='   text-sm font-medium truncate'>{item.control_code}</p>
              <div className='flex  justify-around gap-14 flex-wrap'>
                <div className='flex items-center gap-2'>
                  <p className='text-xs sm:text-sm font-medium text-center'>{item.remediations.total} Actions</p>
                </div>
                <div className='flex items-center gap-2'>
                  <div className="w-8 h-8 sm:w-10 sm:h-10">
                    <CircularProgressbarComponent pathColor='#10b981' progressPercent={parseInt(item.remediations.termine)} />
                  </div>
                  <p className='text-xs sm:text-sm font-medium'>Terminé</p>
                </div>
                <div className='flex items-center gap-2'>
                  <div className="w-8 h-8 sm:w-10 sm:h-10">
                    <CircularProgressbarComponent pathColor='#f97316' progressPercent={parseInt(item.remediations.en_cours)} />
                  </div>
                  <p className='text-xs sm:text-sm font-medium'>En cours</p>
                </div>
              </div>
              <button className='border-none cursor-pointer' 
             // onClick={() => toggleDropdown(item.execution_id)}
              >
                <KeyboardArrowDownIcon fontSize="small" />
              </button>
            </div>
            {openDropdowns[item.execution_id] && (
              <div className="mt-2 w-full overflow-x-auto">
              {controlActionLoading[item.execution_id] ? (

                  <p>Chargement...</p>
                ) : controlActionData[item.execution_id]?.length === 0 ? (
                  <div className="flex border justify-center items-center h-10">
                    <p>Aucune action</p>
                  </div>
                ) : (
                  <Table
                  key={JSON.stringify(controlActionData[item.execution_id])}
                  columnsConfig={columnsConfig2}
                  rowsData={controlActionData[item.execution_id] || []}
                    checkboxSelection={false}
                    headerTextBackground="white"
                    headerBackground="var(--blue-menu)"
                  />

                )}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>

  )
}

export default RemediationActionData