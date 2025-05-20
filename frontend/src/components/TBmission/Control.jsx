
import React, { useState } from 'react';
import Table from '../Table';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function Control({ data ,grid_cols='grid-cols-1',size}) {
    const [selected, setSelected] = useState(null);

    const getColor = (nom) => {
        switch (nom.toLowerCase()) {
            case 'commencé': return ' border border-yellow-300';
            case 'nom commencé': return ' border border-gray-500';
            case 'effective': return 'border border-green-500';
            case 'inéffective': return 'border border-red-500';
            case 'appliad': return 'border-l-4 border-l-green-600';
            case 'partially appliad': return 'border-l-4 border-l-orange-600';
            case 'not appliad': return 'border-l-4 border-l-red-600';
            case 'not tested': return 'border-l-4 border-l-gray-600';
            case 'not applicable': return 'border-l-4 border-l-blue-600';
            default: return 'bg-white';
        }
    };
    const sizeStyles = {
        small: {
            text: 'text-[10px]',
            SousText:'text-[12px]',
            barContainerWidth: 'w-[60%]',
            dateText: 'text-[10px]',
        },
        medium: {
            text: 'text-[13px]',
            SousText:'text-[15px]',
            barContainerWidth: 'w-[70%]',
            dateText: 'text-xs',
        },
        large: {
            text: 'text-[15px]',
            SousText:'text-[16px]',
            barContainerWidth: 'w-full',
            dateText: 'text-sm',
        }
    };
    const styles = sizeStyles[size] || sizeStyles.medium;

    const columnsConfig2 = [

        { field: "controlCode", headerName: "Control Code", width: 100, expandable: true },
        { field: "controlDescription", headerName: "Description", width: 300, expandable: true },
        { field: "executionControlOwner", headerName: "Owner", width: 120, expandable: true },
        { field: "layerName", headerName: "Layer", width: 100, expandable: true },
        { field: "statusName", headerName: "Status", width: 150, expandable: true },
        { field: "userFullName", headerName: "Tester", width: 150, expandable: true }]

    const ControlData = [
        { id: "1", controlCode: "CTRL_645", controlDescription: "description du control CTRL_645", executionControlOwner: "farid akbi", layerName: "BD", statusName: "appliad", userFullName: 'azyadi zouaghi' },
        { id: "2", controlCode: "CTRL_645", controlDescription: "description du control CTRL_645", executionControlOwner: "farid akbi", layerName: "BD", statusName: "", userFullName: 'azyadi zouaghi' },
        { id: "3", controlCode: "CTRL_645", controlDescription: "description du control CTRL_645", executionControlOwner: "farid akbi", layerName: "BD", statusName: "appliad", userFullName: 'azyadi zouaghi' },
        { id: "4", controlCode: "CTRL_645", controlDescription: "description du control CTRL_645", executionControlOwner: "farid akbi", layerName: "BD", statusName: "", userFullName: 'azyadi zouaghi' },
    ]
    return (
        <>
            <div className={`grid  ${grid_cols} gap-4`}>
                {data.map((item) => (
                    <div
                        key={item.id}
                        className={`cursor-pointer flex justify-between p-2 items-center  rounded shadow-sm hover:shadow-md transition duration-200 ${getColor(item.nom)}`}
                        onClick={(e) => {
                            e.stopPropagation(); // 👈 Empêche la redirection
                            setSelected(item);
                          }}
                    >
                        <p className={`${styles.text} py-1 text-center font-medium`}>{item.nom}</p>
                        <span className={`${styles.SousText} text-right font-semibold   text-black `}>
                            {item.pourcentage}%
                        </span>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selected && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                onClick={(e) => {
                    e.stopPropagation(); 
                    setSelected(null);    
                  }}
                >
                    <div className="bg-white p-6 rounded shadow-lg w-[80%] text-center relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();  
                                setSelected(null);    
                              }}
                            className="absolute top-2 border-none  right-2 text-gray-600 hover:text-black text-xl font-bold"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-bold mb-4">Détail des contrôle {selected.nom}</h2>
                        <div className="flex flex-row gap-8 my-8 justify-center">

                            {selected.nom === 'Commencé' &&
                                <>
                                    <div className="flex items-center gap-4  border-l-4 border-l-green-600  px-4 py-2 rounded shadow-sm">
                                        <CheckCircleIcon className="text-green-600" />
                                        <p className="text-sm font-medium">
                                            Contrôle finalisé : <strong>{selected.pourcentage}%</strong>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2  border-l-4 border-l-red-600  px-4 py-2 rounded shadow-sm">
                                        <CancelIcon className="text-red-600" />
                                        <p className="text-sm font-medium">
                                            Contrôle non finalisé : <strong>{35}%</strong>
                                        </p>
                                    </div>
                                </>
                            }
                            {selected.nom === 'inéffective' &&
                                <>
                                    <div className="flex items-center gap-2 border-l-4 border-l-orange-600 px-4 py-2 rounded shadow-sm">
                                        <p className="text-sm font-medium">
                                            Partially appliad : <strong>{selected.pourcentage}%</strong>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 border-l-4 border-l-red-600 px-4 py-2 rounded shadow-sm">
                                        <p className="text-sm font-medium">
                                            Not appliad : <strong>{23}%</strong>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 border-l-4 border-l-blue-600   px-4 py-2 rounded shadow-sm">
                                        <p className="text-sm font-medium">
                                            Not tested : <strong>{7}%</strong>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 border-l-4 border-l-black-600   px-4 py-2 rounded shadow-sm">
                                        <p className="text-sm font-medium">
                                            Not applicable : <strong>{5}%</strong>
                                        </p>
                                    </div>
                                </>
                            }
                        </div>
                        <div className="overflow-auto max-h-[300px] w-full my-4">
                            <Table
                                key={JSON.stringify(ControlData)}
                                columnsConfig={columnsConfig2}
                                rowsData={ControlData}
                                checkboxSelection={false}
                                headerTextBackground="white"
                                headerBackground="var(--blue-menu)"
                            />
                        </div>


                    </div>
                </div>
            )}
        </>
    );
}

export default Control;
