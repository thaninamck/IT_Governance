
import React, { useEffect, useState } from 'react';
import Table from '../Table';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { api } from '../../Api';
import { useDashboard } from '../../Hooks/useDashboard';

function Control({ statusControl, data, grid_cols = 'grid-cols-1', size, statusControlDataPerIneff, statusControlDataPerCommencé }) {
    console.log("status control from ", statusControl)
    const {
        executionData,
        loading,
        fetchExecutionData,
        setSelectedExecution,
        setExecutionData,
        fetchMissionReport,
    } = useDashboard();
    console.log("status control from execution data", executionData)
    const [hasFetchedIneffective, setHasFetchedIneffective] = useState(false);

    //Vérification que statusControl a bien un ID
    if (!statusControl?.id && !statusControl?.mission_id) {
        console.error("statusControl doit avoir soit 'id' soit 'mission_id'");
        return <div>Erreur de configuration: ID de mission manquant</div>;
    }

    const getColor = (nom) => {
        switch (nom.toLowerCase()) {
            case 'commencés': return ' border border-yellow-300';
            case 'non commencés': return ' border border-gray-500';
            case 'effectifs': return 'border border-green-500';
            case 'ineffectifs': return 'border border-red-500';
            case 'applied': return 'border-l-4 border-l-green-600';
            case 'partially applied': return 'border-l-4 border-l-orange-600';
            case 'not applied': return 'border-l-4 border-l-red-600';
            case 'not tested': return 'border-l-4 border-l-gray-600';
            case 'not applicable': return 'border-l-4 border-l-blue-600';
            default: return 'bg-white';
        }
    };
    const sizeStyles = {
        small: {
            text: 'text-[10px]',
            SousText: 'text-[12px]',
            barContainerWidth: 'w-[60%]',
            dateText: 'text-[10px]',
        },
        medium: {
            text: 'text-[13px]',
            SousText: 'text-[15px]',
            barContainerWidth: 'w-[70%]',
            dateText: 'text-xs',
        },
        large: {
            text: 'text-[15px]',
            SousText: 'text-[16px]',
            barContainerWidth: 'w-full',
            dateText: 'text-sm',
        }
    };
    const styles = sizeStyles[size] || sizeStyles.medium;
    const columnsConfig2 = [

        { field: "control_code", headerName: "Control Code", width: 100, expandable: true },
        { field: "description", headerName: "Description", width: 300, expandable: true },
        { field: "owner", headerName: "Owner", width: 120, expandable: true },
        { field: "system_name", headerName: "Système", width: 120, expandable: true },
        { field: "layer", headerName: "Layer", width: 100, expandable: true },
        {
            field: "execution_status",
            headerName: "État d'exécution",
            width: 150,
            expandable: true,
            customRenderCell: (params) => {
              const status = params.value?.toLowerCase();
              let colorClass = "text-gray-800";
              let label = params.value;
              
              if (status === "non commencé") {
                colorClass = "text-gray-500";
              } else if (status === "en cours") {
                colorClass = "text-blue-500";
              } else if (status === "en cours de remediation") {
                colorClass = "text-orange-400";
              } else if (status === "terminé mais pas soumis") {
                colorClass = "text-yellow-400";
              } else if (status === "en cours de revue") {
                colorClass = "text-purple-500";
              } else if (status === "terminé et validé") {
                colorClass = "text-green-500";
              } else if (status === "a coriger") {
                colorClass = "text-red-500";
              } else if (status === "en cours de validation") {
                colorClass = "text-green-700";
              }
              
          
              return (
                <div className='flex items-center justify-center w-full'>
                <span
                  className={`text-sm text-center  ${colorClass}`}
                 
                >
                  {label}
                </span>
                </div>
              );
            },
          }
      ,    
        { field: "status", headerName: "Status", width: 150, expandable: true },
        { field: "testeur", headerName: "Tester", width: 150, expandable: true }]

    const pourcentageControlFinalisé = statusControl?.controlCommencé?.nbrFinalisé && statusControl?.controlCommencé?.nbrTotale
        ? Math.round((statusControl.controlCommencé.nbrFinalisé * 100) / statusControl.controlCommencé.nbrTotale)
        : 0;

    const pourcentageControlNonFinalisé = statusControl?.controlCommencé?.nbrNonFinalisé && statusControl?.controlCommencé?.nbrTotale
        ? Math.round((statusControl.controlCommencé.nbrNonFinalisé * 100) / statusControl.controlCommencé.nbrTotale)
        : 0;


    useEffect(() => {
        const nom = executionData.selected?.nom?.toLowerCase();
        const missionId = statusControl.mission_id || statusControl.id;

        if (!executionData.selected || !missionId) return;

        const handleFilter = async () => {
            try {
                if (nom === 'effectifs' || nom === 'applied') {
                    await fetchExecutionData('effectifs', missionId);
                }
                else if (nom === 'ineffectifs') {
                    if (executionData.allIneffective.length === 0) {
                        await fetchExecutionData('ineffectifs', missionId);
                    }
                }
                else if (['partially applied', 'not applied', 'not tested', 'not applicable'].includes(nom)) {
                    if (executionData.allIneffective.length > 0) {
                        const filtered = executionData.allIneffective.filter(item =>
                            item.status?.toLowerCase() === nom
                        );
                        setExecutionData(prev => ({
                            ...prev,
                            displayed: filtered
                        }));
                    } else {
                        await fetchExecutionData('ineffectifs', missionId);
                        const filtered = executionData.allIneffective.filter(item =>
                            item.status?.toLowerCase() === nom
                        );
                        setExecutionData(prev => ({
                            ...prev,
                            displayed: filtered
                        }));
                    }
                }
                else if (nom === 'commencés') {
                    await fetchExecutionData('began', missionId);
                }
                else if (nom === 'non commencés') {
                    await fetchExecutionData('unbegan', missionId);
                }
            } catch (error) {
                console.error("Error filtering data:", error);
            }
        };

        handleFilter();
    }, [
        executionData.selected,
        statusControl.mission_id,
        statusControl.id,
        fetchExecutionData,
        setExecutionData,
        executionData.allIneffective
    ]);

    return (
        <>

            <div className={`grid  ${grid_cols} gap-4`}>

                {data?.map((item) => (
                    <div
                        key={item.id}
                        className={`cursor-pointer flex justify-between p-2 items-center  rounded shadow-sm hover:shadow-md transition duration-200 ${getColor(item.nom)}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExecution(item);
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
            {executionData.selected && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExecution(null);
                    }}
                >
                    <div className="bg-white p-6 rounded shadow-lg w-[80%] text-center relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedExecution(null);
                            }}
                            className="absolute top-2 border-none  right-2 text-gray-600 hover:text-black text-xl font-bold"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-bold mb-4">Détail des contrôle {executionData.selected.nom}</h2>
                        <div className="flex flex-row gap-8 my-8 justify-center">

                            {executionData.selected.nom === 'Commencés' &&
                                statusControlDataPerCommencé?.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`relative group flex items-center gap-4 border-l-4 ${item.nom === 'Contrôles finalisés' ? 'border-l-green-600' : 'border-l-red-600'
                                            } px-4 py-2 rounded shadow-sm`}
                                    >
                                        {item.nom === 'Contrôles finalisés' ? (
                                            <CheckCircleIcon className="text-green-600" />
                                        ) : (
                                            <CancelIcon className="text-red-600" />
                                        )}
                                        <p className="text-sm font-medium">
                                            {item.nom} : <strong>{item.pourcentage}%</strong>
                                        </p>
                                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1">
                                            {item.nom === 'Contrôles finalisés'
                                                ? `${statusControl?.controlCommencé?.nbrFinalisé} contrôles finalisés`
                                                : `${statusControl?.controlCommencé?.nbrNonFinalisé} contrôles non finalisés`}
                                        </div>
                                    </div>
                                ))}

                            {executionData.selected.nom === 'ineffectifs' &&
                                <div className="flex  gap-6">
                                    {statusControlDataPerIneff?.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`
                                       flex items-center gap-2 
                                       border-l-4
                                       ${item.nom.toLowerCase() === "partially applied" ? "border-l-orange-600"
                                                    : item.nom.toLowerCase() === "not applied" ? "border-l-red-600"
                                                        : item.nom.toLowerCase() === "not tested" ? "border-l-blue-600"
                                                            : item.nom.toLowerCase() === "not applicable" ? "border-l-black" // corrige la classe si tu veux une autre couleur
                                                                : "border-l-gray-600"}
                                       px-4 py-2 rounded shadow-sm
                                     `}
                                        >
                                            <p className="text-sm font-medium">
                                                {item.nom} : <strong>{item.pourcentage}%</strong>
                                            </p>
                                        </div>
                                    ))}
                                </div>

                            }
                        </div>
                        <div className="overflow-auto max-h-[300px] w-full my-4">
                            {loading ?
                                <div className="flex justify-center items-center h-32">
                                    <p>Chargement en cours...</p>
                                </div>
                                : executionData.displayed?.length == 0 ? (
                                    <div className="flex justify-center items-center h-32">
                                        <p>Aucune execution </p>
                                    </div>
                                ) : (
                                    <Table
                                        key={JSON.stringify(executionData.displayed)}
                                        columnsConfig={columnsConfig2}
                                        rowsData={executionData.displayed}
                                        checkboxSelection={false}
                                        headerTextBackground="white"
                                        headerBackground="var(--blue-menu)"
                                    />
                                )}
                        </div>


                    </div>
                </div>
            )}
        </>
    );
}

export default Control;
