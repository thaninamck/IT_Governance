import React, { useEffect, useState } from 'react'
import SideBarStdr from '../../components/sideBar/SideBarStdr'
import { useAuth } from '../../Context/AuthContext'
import HeaderBis from '../../components/Header/HeaderBis';
import HeaderWithAction from '../../components/Header/HeaderWithAction';
import SearchBar from '../../components/SearchBar';
import ExportButton from '../../components/ExportButton';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import VisibilityIcon from "@mui/icons-material/Visibility";
import Table from '../../components/Table';
import { useNavigate } from 'react-router-dom';
import { api } from '../../Api';

function GestionRevue() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [revueMissionData, setRevueMissionData] = useState([
        // { "id": "1", "clientName": "djezzy", "missionName": "DSP", "manager": "houda", "status": 'en cours' }
    ]);
    const [filteredRows, setFilteredRows] = useState([]);
    const columnsConfig2 = [
        { field: "clientName", headerName: "Client", width: 170 },
        { field: "missionName", headerName: "Mission", width: 170 },
        { field: "manager", headerName: "Manager", width: 200 },
        { field: "status", headerName: "Status", width: 220 },
        { field: "actions", headerName: "Actions", width: 80 },
    ];

    const rowActions = [
        {
            icon: <LockOpenRoundedIcon sx={{ marginRight: "5px" }} />,
            label: "Clôturée",
            // onClick: handleCloturerRow,
        },
        {
            icon: <VisibilityIcon sx={{ color: "var(--font-gray)", marginRight: "5px" }} />,
            label: "Voir rapport",
            // onClick: handleViewReport,
        },
    ];
    const handleSearchResults = (results) => setFilteredRows(results);
    const handleRowClick = (rowData) => {
        navigate(`/revue/${rowData.missionName}`, { state: { missionRevueData: rowData } });
        console.log('Détails du mission revue sélectionné:', rowData);
    }
    // Appel API à l'affichage
    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const response = await api.get(`/revue/getmissionexecutionreviewedforSuperviseur`);
                const missions = response.data|| [];
                console.log('response',missions)
                setRevueMissionData(missions);
                setFilteredRows(missions);
            } catch (error) {
                console.error("Erreur lors du chargement des missions à revoir :", error);
            }
        };

        fetchMissions();
    }, []);

    return (
        <div className='flex'>
            <SideBarStdr user={user} />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <HeaderBis />
                <HeaderWithAction
                    title="Revues"
                    buttonLabel=""
                    user={user}
                />
                <div className="flex items-center justify-center mb-6">
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
                </div>
                <div className={"flex-1 overflow-x-auto overflow-y-auto h-[400px] transition-all"}>
                    {revueMissionData.length === 0 ? (
                        <p className="text-center text-subfont-gray mt-20">
                            Aucun Revue  pour le moment.
                        </p>
                    ) : (
                        <Table
                            key={JSON.stringify(revueMissionData)}
                            columnsConfig={columnsConfig2}
                            rowsData={revueMissionData}
                            checkboxSelection={false}
                            onRowClick={handleRowClick}
                            headerTextBackground={"white"}
                            headerBackground="var(--blue-menu)"
                            rowActions={rowActions}
                        />
                    )}
                </div>
            </div>


        </div>
    )
}

export default GestionRevue