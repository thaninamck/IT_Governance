import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header';
import { useAuth } from '../../Context/AuthContext';
import SearchBar from '../../components/SearchBar';
import ExportButton from '../../components/ExportButton';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import VisibilityIcon from "@mui/icons-material/Visibility";
import Table from '../../components/Table';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { api } from '../../Api';
import useRevue from '../../Hooks/useRevue';
import Separator from '../../components/Decorators/Separator';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


function RevueListExecution( {dataFormat}) {

    const { loading, error, fetchRevueExecutions ,fetchRevueExecutionsForApp} = useRevue();

    const navigate = useNavigate();
    const { user } = useAuth();
    const { missionRevue } = useParams(); // Récupérer les paramètres de l'URL
    const location = useLocation(); // Obtenir l'URL actuelle

    console.log("Mission revue sélectionnée :", missionRevue);
    //const missionRevueData = location.state?.missionRevueData; // Récupérer les données envoyées

    console.log('données récupérer DataFormat', dataFormat)

    const [revueMissionData, setRevueMissionData] = useState([]);
    console.log('now', revueMissionData)
    const breadcrumbRoutes = [
        "/missions",
        "/tablemission",
        "/missionInfo",
        "/statusmission",
        "/table",
        "/tableApp",
        "/rapportmission", // Ajout pour la page principale
        "/rapportmission/:missionName", // Ajout pour une mission spécifique
    ];

    const [filteredRows, setFilteredRows] = useState([]);
    const [systemName, setSystemName] = useState();
    const columnsConfig2 = [
        { field: "controlCode", headerName: "Code", width: 170 },
        { field: "executionModification", headerName: "Control", width: 170, expandable: true },
        { field: "majorProcess", headerName: "Major Process", width: 200, expandable: true },
        { field: "subProcess", headerName: "Sub Process", width: 220, expandable: true },
        {
            field: "executionControlOwner",
            headerName: "Propriétaire",
            expandable: true,
            width: 200,
            customRenderCell: (params) => {
                const handleCopy = () => {
                    const email = params.row.systemOwnerEmail;
                    if (email) {
                        navigator.clipboard.writeText(email);
                        alert(`Email copié : ${email}`);
                    } else {
                        alert("Email non disponible.");
                    }
                };

                return (
                    <div
                        onClick={handleCopy}
                        title="Cliquez pour copier l'e-mail"
                        className="flex items-center gap-2 text-blue-700 hover:text-blue-900 cursor-pointer"
                    >
                        <span>{params.row.executionControlOwner}</span>
                        <ContentCopyIcon sx={{ fontSize: 16, width: '20px', height: '20px' }} />
                    </div>
                );
            },
        },

        {
            field: "executionStatus",
            headerName: "Statut",
            expandable: true,
            width: 160,
            customRenderCell: (params) => {
                const colorMap = {
                    "applied": "text-green-500",
                    "partially applied": "text-yellow-500",
                    "not applied": "text-red-500",
                };
                const color = colorMap[params.row.executionStatus] || "text-gray-400";

                return (

                    <span className={` px-2  rounded ${color}`}>
                        {params.row.executionStatus}

                    </span>
                );
            },
        },
        { field: "testerName", headerName: "Testeur", width: 220 },
        {
            field: "consulter",
            headerName: "Consulter",
            expandable: true,
            width: 160,
            customRenderCell: (params) => (
                <button
                    onClick={() => navigate(`/revue/${params.row.missionName}/${params.row.controlCode}`, { state: { controleData: params.row } })}
                    className="text-white bg-blue-500 hover:bg-blue-600 px-6 h-[40px] flex items-center rounded border-none"
                >
                    Consulter
                </button>
            ),
        },
       
    ];

   
    const handleSearchResults = (results) => setFilteredRows(results);
    // Appel API à l'affichage

    useEffect(() => {
        const loadData = async () => {
          let data;
          if (dataFormat?.profileName) {
            // Cas normal
            data = await fetchRevueExecutions(dataFormat);
          } else {
            // Cas admin
            data = await fetchRevueExecutionsForApp(dataFormat);
          }
      
          setRevueMissionData(data);
          setFilteredRows(data);
        };
      
        loadData();
      }, [dataFormat]);
      
    
    console.log('revue mission data',revueMissionData)

    { loading && <p className="text-center mt-10">Chargement...</p> }
    { error && <p className="text-red-500 text-center mt-4">{error}</p> }


    // useEffect(() => {

    //     const fetchexecutionMissionsSupervisuer = async () => {
    //         try {
    //             const response = await api.get(`/revue/${missionRevueData.id}/getexecutionreviewedforSuperviseur`);
    //             const missions = response.data|| [];
    //             console.log('response',response.data)
    //             setRevueMissionData(missions);
    //             setFilteredRows(missions);
    //         } catch (error) {
    //             console.error("Erreur lors du chargement des missions à revoir :", error);
    //         }
    //     };

    //     fetchexecutionMissionsSupervisuer();
    // }, []);

    // useEffect(() => {
    //     const fetchexecutionMissionsManager = async () => {
    //         try {
    //             const response = await api.get(`/revue/${missionRevueData.id}/getexecutionreviewedforManager`);
    //             const missions = response.data|| [];
    //             console.log('response',missions)
    //             setRevueMissionData(missions);
    //             setFilteredRows(missions);
    //         } catch (error) {
    //             console.error("Erreur lors du chargement des missions à revoir :", error);
    //         }
    //     };

    //     fetchexecutionMissionsManager();
    // }, []);

    return (
        <div className=''>
            {/* <Header user={user} />
            <div className=" ml-5 mr-6 pb-9">
                {breadcrumbRoutes.some((route) =>
                    location.pathname.startsWith(route)
                ) && <Breadcrumbs />}

                <div className="flex items-center justify-center mt-20 mb-6">
                    <SearchBar
                        columnsConfig={columnsConfig2}
                        initialRows={revueMissionData}
                        onSearch={handleSearchResults}
                    />
                </div>
                <div className="flex justify-end items-center gap-4 pr-10 mb-6">
                    <ExportButton
                        rowsData={filteredRows}
                        headers={columnsConfig2.map((col) => col.headerName)}
                        fileName="Revue"
                    />
                </div> */}
                
               
                    {revueMissionData?.length === 0 ? (
                       <></>
                    ) : (
                        <>
                        <Separator text={<div className="flex items-center gap-2">
                            <CheckCircleOutlineIcon fontSize="small" color="primary" />
                            Liste des contrôles exécutés
                        </div>} />
                        <div className="flex-1 mr-10 overflow-x-auto overflow-y-auto h-[400px] transition-all">
                        <Table
                            key={JSON.stringify(revueMissionData)}
                            columnsConfig={columnsConfig2}
                            rowsData={revueMissionData}
                            checkboxSelection={false}
                           // headerTextBackground={"black"}
                            headerBackground="var(--blue-nav)"
                           
                        />
                        </div>
                        </>
                    )}
                
            </div>

        // </div>
    )
}

export default RevueListExecution