
import React, { useState } from 'react'
import Table from '../Table'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircularProgressbarComponent from './CircularProgressbarComponent';

function RemediationActionData({data,getColor}) {
     const [openDropdowns, setOpenDropdowns] = useState({});
        const toggleDropdown = (id) => {
            setOpenDropdowns((prev) => ({
                ...prev,
                [id]: !prev[id],
            }));
        };
    const columnsConfig2 = [
    
            { field: "actionCode", headerName: "Action", width: 200, expandable: true },
            { field: "description", headerName: "Description", width: 300, expandable: true },
            { field: "ActionOwner", headerName: "Owner", width: 120, expandable: true },
            { field: "suivi", headerName: "Suivi", width: 270, expandable: true },
            { field: "statusAction", headerName: "Status", width: 100, expandable: true },
        ]
    
        const ControlActionData = [
            { id: "1", actionCode: "Act_25Nov_CTRL_645", description: "description de l'action 1", ActionOwner: "farid akbi", suivi: "le suivi de l'action", statusAction: "En cours" },
            { id: "2", actionCode: "Act_25Nov_CTRL_645", description: "description de l'action 2", ActionOwner: "farid akbi", suivi: "le suivi de l'action", statusAction: "En cours" },
            { id: "3", actionCode: "Act_25Nov_CTRL_645", description: "description de l'action 3", ActionOwner: "farid akbi", suivi: "le suivi de l'action", statusAction: "Terminé" },
            { id: "4", actionCode: "Act_25Nov_CTRL_645", description: "description de l'action 4", ActionOwner: "farid akbi", suivi: "le suivi de l'action", statusAction: "Terminé" },
            { id: "5", actionCode: "Act_25Nov_CTRL_645", description: "description de l'action 5", ActionOwner: "farid akbi", suivi: "le suivi de l'action", statusAction: "Terminé" },
        ]
  return (
    <div className='px-4 sm:px-8 lg:px-16 pb-4 mb-8'>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4'>
      {data.map((item) => (
        <div key={item.id} className='flex flex-col px-4'>
          <div className={`border border-black cursor-pointer border-l-4 border-l-orange-600 flex justify-between items-center py-2 lg:px-4 gap-4  sm:pl-0 rounded shadow-sm hover:shadow-md transition duration-200 ${getColor(item.nom)}`}>
            <p className='   text-sm font-medium truncate'>{item.nom}</p>
            <div className='flex  justify-around gap-14 flex-wrap'>
              <div className='flex items-center gap-2'>
                <p className='text-xs sm:text-sm font-medium text-center'>{item.NbrAction} Actions</p>
              </div>
              <div className='flex items-center gap-2'>
                <div className="w-8 h-8 sm:w-10 sm:h-10">
                  <CircularProgressbarComponent progressPercent={parseInt(item.pourcentageTerminé)} />
                </div>
                <p className='text-xs sm:text-sm font-medium'>Terminé</p>
              </div>
              <div className='flex items-center gap-2'>
                <div className="w-8 h-8 sm:w-10 sm:h-10">
                  <CircularProgressbarComponent progressPercent={parseInt(item.pourcentageEncours)} />
                </div>
                <p className='text-xs sm:text-sm font-medium'>En cours</p>
              </div>
            </div>
            <button className='border-none cursor-pointer' onClick={() => toggleDropdown(item.id)}>
              <KeyboardArrowDownIcon fontSize="small" />
            </button>
          </div>
          {openDropdowns[item.id] && (
            <div className="mt-2 w-full overflow-x-auto">
              <Table
                key={JSON.stringify(ControlActionData)}
                columnsConfig={columnsConfig2}
                rowsData={ControlActionData}
                checkboxSelection={false}
                headerTextBackground="white"
                headerBackground="var(--blue-menu)"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
  
  )
}

export default RemediationActionData