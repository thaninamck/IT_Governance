
import React, { useEffect, useState } from 'react';
import Table from '../Table';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { api } from '../../Api';

function Control({ statusControl, data, grid_cols = 'grid-cols-1', size }) {
    // Vérification que statusControl a bien un ID
    if (!statusControl?.id && !statusControl?.mission_id) {
        console.error("statusControl doit avoir soit 'id' soit 'mission_id'");
        return <div>Erreur de configuration: ID de mission manquant</div>;
    }
    console.log('data control ', data)
    console.log('statusControldata ', statusControl)

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

    const [ExecutionData, setExecutionData] = useState({});
    const [loading, setLoading] = useState(false);
    const [allIneffectiveData, setAllIneffectiveData] = useState([]);
    const [displayedExecutionData, setDisplayedExecutionData] = useState([]);
    const [selected, setSelected] = useState(null);

    const pourcentageControlFinalisé =  Math.round((statusControl?.controlCommencé?.nbrFinalisé/statusControl?.controlCommencé?.nbrTotale)*100)
    const pourcentageControlNonFinalisé =  Math.round((statusControl?.controlCommencé?.nbrNonFinalisé/statusControl?.controlCommencé?.nbrTotale)*100)

    const fetchIneffectiveExecutionData = async () => {
        try {
           
            // Utilisez mission_id si disponible, sinon id
            const missionId = statusControl.mission_id || statusControl.id;
            if (!missionId) {
                console.error("ID de mission non disponible");
                return;
            }

            const response = await api.get(`/dashboard/missions/${missionId}/ineffective-controls`);
            setAllIneffectiveData(response.data);
            setDisplayedExecutionData(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des ineffective-controls :", error);
        } 
    };

    const fetchEffectiveExecutionData = async () => {
        try {
            setLoading(true);
            // Utilisez mission_id si disponible, sinon id
            const missionId = statusControl.mission_id || statusControl.id;
            if (!missionId) {
                console.error("ID de mission non disponible");
                return;
            }

            const response = await api.get(`/dashboard/missions/${missionId}/effective-controls`);
            setDisplayedExecutionData(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des effective-controls :", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBeganExecutionData = async () => {
        try {
            setLoading(true);
            // Utilisez mission_id si disponible, sinon id
            const missionId = statusControl.mission_id || statusControl.id;
            if (!missionId) {
                console.error("ID de mission non disponible");
                return;
            }

            const response = await api.get(`/dashboard/missions/${missionId}/began-controls`);
            console.log('bagan',response.data)
            setDisplayedExecutionData(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des began-controls :", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnBeganExecutionData = async () => {
        try {
            setLoading(true);
            // Utilisez mission_id si disponible, sinon id
            const missionId = statusControl.mission_id || statusControl.id;
            if (!missionId) {
                console.error("ID de mission non disponible");
                return;
            }

            const response = await api.get(`/dashboard/missions/${missionId}/unbegan-controls`);
            console.log('unbagan',response.data)
            setDisplayedExecutionData(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des began-controls :", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const nom = selected?.nom?.toLowerCase();
        console.log('nom ', nom);

        const handleFilter = async () => {
            const missionId = statusControl.mission_id || statusControl.id;
            if (!missionId) return;

            if (nom === 'effective' || nom === 'appliad') {
                await fetchEffectiveExecutionData();
            } else if (nom === 'ineffective') {
                await fetchIneffectiveExecutionData();
            } else if (nom === 'partially appliad' || nom === 'not applied' || nom === 'not tested' || nom === 'not applicable'  )  {
                if (allIneffectiveData.length > 0) {
                    const filtered = allIneffectiveData.filter((item) =>
                        item.status?.toLowerCase() === nom
                    );
                    setDisplayedExecutionData(filtered);
                } else {
                    const response = await api.get(`/dashboard/missions/${missionId}/ineffective-controls`);
                    setAllIneffectiveData(response.data);

                    const filtered = response.data.filter((item) =>
                        item.status?.toLowerCase() === nom
                    );
                    setDisplayedExecutionData(filtered);
                }
            }else if (nom === 'commencé' ){
                await fetchBeganExecutionData();
            }
            else if (nom === 'non commencé' ){
                await fetchUnBeganExecutionData();
            }
        };

        if (selected) {
            handleFilter();
        }
    }, [selected, allIneffectiveData]);

    // const fetchIneffectiveExecutionData = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await api.get(`/dashboard/missions/${statusControl.mission_id}/ineffective-controls`);
    //         console.log('Ineffective controls:', response.data);
    //         setAllIneffectiveData(response.data);
    //         console.log('innefctive', allIneffectiveData)
    //         setDisplayedExecutionData(response.data); // par défaut
    //     } catch (error) {
    //         console.error("Erreur lors de la récupération des ineffective-controls :", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    // const fetchEffectiveExecutionData = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await api.get(`/dashboard/missions/${statusControl?.mission_id}/effective-controls`);
    //         console.log('db manager control action data', response.data)

    //         setDisplayedExecutionData(response.data);
    //     } catch (error) {
    //         console.error("Erreur lors de la récupération des setControlActionData :", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     const nom = selected?.nom?.toLowerCase();
    //     console.log('nom ', nom);

    //     const handleFilter = async () => {
    //         if (nom === 'effective' || nom === 'appliad') {
    //             await fetchEffectiveExecutionData();
    //         } else if (nom === 'ineffective') {
    //             await fetchIneffectiveExecutionData();
    //         } else if (nom === 'partially appliad' || nom === 'not applied' || nom === 'not tested' || nom === 'not applicable') {
    //             // Si on a déjà des données, les utiliser
    //             if (allIneffectiveData.length > 0) {
    //                 const filtered = allIneffectiveData.filter((item) =>
    //                     item.status?.toLowerCase() === nom
    //                 );
    //                 setDisplayedExecutionData(filtered);

    //                 if (filtered.length === 0) {
    //                     console.log(`Aucune donnée trouvée pour le statut: ${nom}`);
    //                 }
    //             } 
    //             // Sinon charger les données d'abord
    //             else {
    //                 const response = await api.get(`/dashboard/missions/${statusControl.mission_id}/ineffective-controls`);
    //                 setAllIneffectiveData(response.data);

    //                 const filtered = response.data.filter((item) =>
    //                     item.status?.toLowerCase() === nom
    //                 );
    //                 setDisplayedExecutionData(filtered);

    //                 if (filtered.length === 0) {
    //                     console.log(`Aucune donnée trouvée pour le statut: ${nom}`);
    //                 }
    //             }
    //         }
    //     };

    //     if (selected) {
    //         handleFilter();
    //     }
    // }, [selected]);
    return (
        <>
            <div className={`grid  ${grid_cols} gap-4`}>
                {data?.map((item) => (
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
                            {selected.nom === 'ineffective' &&
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
                            { loading ? 
                                <div className="flex justify-center items-center h-32">
                                    <p>Chargement en cours...</p>
                                </div>
                                : 
                           
                                displayedExecutionData?.length == 0 ? (
                                <div className="flex justify-center items-center h-32">
                                       <p>Aucune execution </p>
                                   </div>
                            ) : (
                            <Table
                                key={JSON.stringify(displayedExecutionData)}
                                columnsConfig={columnsConfig2}
                                rowsData={displayedExecutionData}
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
