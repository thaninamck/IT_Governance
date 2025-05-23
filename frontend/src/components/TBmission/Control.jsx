
import React, { useEffect, useState } from 'react';
import Table from '../Table';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { api } from '../../Api';
import { useDashboard } from '../../Hooks/useDashboard';

function Control({ statusControl, data, grid_cols = 'grid-cols-1', size }) {
    const {
        executionData,
        loading,
        fetchExecutionData,
        setSelectedExecution,
        setExecutionData,
    } = useDashboard();
    const [hasFetchedIneffective, setHasFetchedIneffective] = useState(false);
    // Vérification que statusControl a bien un ID
    // if (!statusControl?.id && !statusControl?.mission_id) {
    //     console.error("statusControl doit avoir soit 'id' soit 'mission_id'");
    //     return <div>Erreur de configuration: ID de mission manquant</div>;
    // }

    const getColor = (nom) => {
        switch (nom.toLowerCase()) {
            case 'commencé': return ' border border-yellow-300';
            case 'non commencé': return ' border border-gray-500';
            case 'effective': return 'border border-green-500';
            case 'ineffective': return 'border border-red-500';
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

        { field: "code", headerName: "Control Code", width: 100, expandable: true },
        { field: "description", headerName: "Description", width: 300, expandable: true },
        { field: "owner", headerName: "Owner", width: 120, expandable: true },
        { field: "layer", headerName: "Layer", width: 100, expandable: true },
        { field: "status", headerName: "Status", width: 150, expandable: true },
        { field: "testeur", headerName: "Tester", width: 150, expandable: true }]

        const pourcentageControlFinalisé = statusControl?.controlCommencé?.nbrFinalisé && statusControl?.controlCommencé?.nbrTotale
        ? Math.round((statusControl.controlCommencé.nbrFinalisé / statusControl.controlCommencé.nbrTotale) * 100)
        : 0;

    const pourcentageControlNonFinalisé = statusControl?.controlCommencé?.nbrNonFinalisé && statusControl?.controlCommencé?.nbrTotale
        ? Math.round((statusControl.controlCommencé.nbrNonFinalisé / statusControl.controlCommencé.nbrTotale) * 100)
        : 0;


        useEffect(() => {
            const nom = executionData.selected?.nom?.toLowerCase();
            const missionId = statusControl.mission_id || statusControl.id;
            
            if (!executionData.selected || !missionId) return;
        
            const handleFilter = async () => {
                try {
                    if (nom === 'effective' || nom === 'appliad') {
                        await fetchExecutionData('effective', missionId);
                    } 
                    else if (nom === 'ineffective') {
                        if (executionData.allIneffective.length === 0) {
                            await fetchExecutionData('ineffective', missionId);
                        }
                    }
                    else if (['partially appliad', 'not applied', 'not tested', 'not applicable'].includes(nom)) {
                        if (executionData.allIneffective.length > 0) {
                            const filtered = executionData.allIneffective.filter(item => 
                                item.status?.toLowerCase() === nom
                            );
                            setExecutionData(prev => ({
                                ...prev,
                                displayed: filtered
                            }));
                        } else {
                            await fetchExecutionData('ineffective', missionId);
                            const filtered = executionData.allIneffective.filter(item => 
                                item.status?.toLowerCase() === nom
                            );
                            setExecutionData(prev => ({
                                ...prev,
                                displayed: filtered
                            }));
                        }
                    }
                    else if (nom === 'commencé') {
                        await fetchExecutionData('began', missionId);
                    } 
                    else if (nom === 'non commencé') {
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
        ]);// Seulement selected comme dépendance

    return (
        <>
            <div className={`grid  ${grid_cols} gap-4`}>
                {data?.map((item) => (
                    <div
                        key={item.id}
                        className={`cursor-pointer flex justify-between p-2 items-center  rounded shadow-sm hover:shadow-md transition duration-200 ${getColor(item.nom)}`}
                        onClick={(e) => {
                            e.stopPropagation(); // 👈 Empêche la redirection
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

                            {executionData.selected.nom === 'Commencé' &&
                                <>
                                    <div className="flex items-center gap-4  border-l-4 border-l-green-600  px-4 py-2 rounded shadow-sm">
                                        <CheckCircleIcon className="text-green-600" />
                                        <p className="text-sm font-medium">
                                            Contrôle finalisé : <strong>{pourcentageControlFinalisé}%</strong>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2  border-l-4 border-l-red-600  px-4 py-2 rounded shadow-sm">
                                        <CancelIcon className="text-red-600" />
                                        <p className="text-sm font-medium">
                                            Contrôle non finalisé : <strong>{pourcentageControlNonFinalisé}%</strong>
                                        </p>
                                    </div>
                                </>
                            }
                            {executionData.selected.nom === 'ineffective' &&
                                <>
                                    <div className="flex items-center gap-2 border-l-4 border-l-orange-600 px-4 py-2 rounded shadow-sm">
                                        <p className="text-sm font-medium">
                                            Partially appliad : <strong>{statusControl?.controlNonEffective?.partiallyApp}%</strong>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 border-l-4 border-l-red-600 px-4 py-2 rounded shadow-sm">
                                        <p className="text-sm font-medium">
                                            Not applied : <strong>{statusControl?.controlNonEffective?.notApp}%</strong>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 border-l-4 border-l-blue-600   px-4 py-2 rounded shadow-sm">
                                        <p className="text-sm font-medium">
                                            Not tested : <strong>{statusControl?.controlNonEffective?.notTested}%</strong>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 border-l-4 border-l-black-600   px-4 py-2 rounded shadow-sm">
                                        <p className="text-sm font-medium">
                                            Not applicable : <strong>{statusControl?.controlNonEffective?.notApplicable}%</strong>
                                        </p>
                                    </div>
                                </>
                            }
                        </div>
                        <div className="overflow-auto max-h-[300px] w-full my-4">
                            {loading ?
                                <div className="flex justify-center items-center h-32">
                                    <p>Chargement en cours...</p>
                                </div>
                                : executionData.displayed?.length  == 0 ? (
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
