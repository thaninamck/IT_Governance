
import React from 'react'
import Table from '../Table'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function RemédiationActionData(data) {
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
    <div className='max-h-[250px] overflow-y-auto overflow-x-hidden pr-2'>
                           <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-3'>
                               {data.map((item) => (
                                   <div
                                       key={item.id}
                                       className={`flex  flex-col px-4 `}
                                   >
                                       <div
                                           className={`border border-black cursor-pointer border-l-4 border-l-orange-600 flex  justify-between py-1 px-4 items-center gap-4 rounded shadow-sm hover:shadow-md transition duration-200 ${getColor(item.nom)}`}
                                       >
                                           <p className='w-[10%] text-l font-medium'>{item.nom}</p>
                                           <div className='flex flex-row justify-between w-[45%]'>
                                               <div className='flex items-center gap-3'>
                                                   <p className='text-center text-[10px] font-medium'>{item.NbrAction} Actions</p>
                                               </div>
                                               <div className='flex items-center gap-3'>
                                                   <div className="w-10 h-10">
                                                       <CircularProgressbarComponent progressPercent={parseInt(item.pourcentageTerminé)} />
                                                   </div>
                                                   <p className='text-center text-[10px] font-medium'>Terminé</p>
                                               </div>
                                               <div className='flex items-center gap-3'>
                                                   <div className="w-10 h-10">
                                                       <CircularProgressbarComponent progressPercent={parseInt(item.pourcentageEncours)} />
                                                   </div>
                                                   <p className='text-center text-[10px] font-medium'>En cours</p>
                                               </div>
                                           </div>
                                           <button className='border-none cursor-pointer' onClick={() => toggleDropdown(item.id)}>
                                               <KeyboardArrowDownIcon />
                                           </button>
                                       </div>
                                       {openDropdowns[item.id] && (
                                           <div className="mt-2  flex justify-center">
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

export default RemédiationActionData