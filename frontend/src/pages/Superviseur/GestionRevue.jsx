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
import useRevue from '../../Hooks/useRevue';

function GestionRevue() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState("manager");
    const {
        revueMissionData,
        setRevueMissionData,
        filteredRows,
        setFilteredRows,
        handleRowClick,
    } = useRevue(activeView);

    
    const columnsConfig2 = [
        { field: "clientName", headerName: "Client", width: 170 },
        { field: "missionName", headerName: "Mission", width: 170 },
        { field: "profileName", headerName: "Profile", width: 200 },
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
    
    return (
        <div className='flex'>
            <SideBarStdr user={user} />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <HeaderBis />
                <HeaderWithAction
                    title={`Revues - ${activeView === "manager" ? "Manager" : "Superviseur"}`}
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
                <div className="flex border-b-2 border-gray-300 mb-3 ml-8">
                    <button
                        className={`px-4 py-2 ${activeView === "manager"
                            ? "rounded-l rounded-r-none border-none bg-gray-200 text-gray-700"
                            : "rounded-none text-[var(--subfont-gray)] border-none"
                            }`}
                        onClick={() => setActiveView("manager")}
                    >
                        Manager
                    </button>
                    <button
                        className={`px-4 py-2 ${activeView === "superviseur"
                            ? "rounded-r rounded-l-none border-none bg-gray-200 text-gray-700"
                            : "rounded-none text-[var(--subfont-gray)] border-none"
                            }`}
                        onClick={() => setActiveView("superviseur")}
                    >
                        Superviseur
                    </button>
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