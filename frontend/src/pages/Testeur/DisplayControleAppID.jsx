import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { PermissionRoleContext } from '../../Context/permissionRoleContext';
import Header from '../../components/Header/Header';
import Breadcrumbs from '../../components/Breadcrumbs';
import AppInfo from '../../components/InfosDisplay/AppInfo';
import Separator from '../../components/Decorators/Separator';
import { useAuth } from '../../Context/AuthContext';
import Table from '../../components/Table';
import { api } from '../../Api';
import { useProfile } from '../../Context/ProfileContext';
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import useExecution from '../../Hooks/useExecution';

function DisplayControleAppID() {

  const {
    loading,
    error,
    fetchExecutionsListForApp,
    fetchExecutionsListForCorrection
  } = useExecution();

  const { profile } = useProfile();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const AppData = location.state?.AppData;
  console.log("APPDATA", AppData)
  const { mission, name } = useParams();

  const breadcrumbRoutes = [
    "/missions",
    "/missions/:mission/:nomApp",
    "/tablemission",
    "gestionmission",
    "/rapportmission",
    "/rapportmission/:missionName",
  ];

 const [appData, setAppData] = useState([]);
  const [correctionExecution, setCorrectionExecution] = useState([]);
  const [activePanel, setActivePanel] = useState("executer");

  console.log("appDATA",appData)
  const columnsConfig2 = [
    { field: "riskCode", headerName: "Risk Code", width: 80, expandable: true },
    { field: "riskDescription", headerName: "Risk Description", width: 200, expandable: true },
    { field: "controlCode", headerName: "Control Code", width: 100, expandable: true },
    { field: "controlDescription", headerName: "Description", width: 200, expandable: true },
    { field: "executionControlOwner", headerName: "Owner", width: 120, expandable: true },
    { field: "layerName", headerName: "Layer", width: 100, expandable: true },
    { field: "executionEtat", headerName: "State", width: 150, expandable: true },
    { field: "statusName", headerName: "Status", width: 150, expandable: true },
    { field: "userFullName", headerName: "Tester", width: 150, expandable: true },
    {
      field: "Lancer",
      headerName: "Action",
      width: 120,
      customRenderCell: (params) => {
        const isCorrection = activePanel === "corriger";
        const isToReview = params.row.isToReview;
        const isToValidate = params.row.isToValidate;
        const status =params.row.statusName;

        let buttonLabel = "Exécuter";
        let buttonColor = "bg-blue-500 hover:bg-blue-600";

        // if (isCorrection) {
          if (!isToReview && !isToValidate && status) {
            buttonLabel = "À corriger";
            buttonColor = "bg-orange-500 hover:bg-orange-600";
          } else if (isToReview && isToValidate && status) {
            buttonLabel = "Valider";
            buttonColor = "bg-green-500 hover:bg-green-600";
          }
        // }

        return (
          <button
            onClick={() =>
              navigate(`/missions/${mission}/${name}/${params.row.controlCode}`, {
                state: { controleData: params.row },
              })
            }
            className={`flex items-center justify-center ${buttonColor} text-white font-semibold border-none h-[40px] w-[100px] rounded shadow`}
          >
            {buttonLabel}
          </button>
        );
      },
    }


  ];

  useEffect(() => {
    const loadData = async () => {
      if ((user?.role || profile) && AppData?.id) {
        const data = await fetchExecutionsListForApp(AppData);

        setAppData(data);
      }
    };
    loadData();
  }, [user, profile, AppData?.id]);




  useEffect(() => {
    const loadCorrectionData = async () => {
      if (AppData?.id) {
        const data = await fetchExecutionsListForCorrection(AppData.missionId, AppData.id);
        setCorrectionExecution(data);
        console.log('correction execution', correctionExecution)
      }
    };
    loadCorrectionData();
  }, [AppData?.id]);

  

  useEffect(() => {

    console.log("corr exec", correctionExecution);
  }, [correctionExecution]);

  const handleTabChange = (event, newValue) => {
    setActivePanel(newValue === 0 ? "executer" : "corriger");
  };

  const handleRowClick = (rowData) => {
    navigate(`/missions/${mission}/${name}/${rowData.controlCode}`, { state: { controleData: rowData } });
  };

  return (
    <div className="min-h-screen ">
      <Header user={user} />
      <div className="ml-5 mr-6 pb-9">
        {breadcrumbRoutes.some((route) => location.pathname.startsWith(route)) && <Breadcrumbs />}
        <AppInfo appId={AppData.id} />
        <Separator text="List des Contrôles" />
        {
          (AppData?.profile === 'manager' || AppData?.profile === 'superviseur' || user?.role === 'admin') ? (
            appData.length > 0 ? (
              <div className="flex-1 overflow-x-auto overflow-y-auto transition-all">
              <Table
                key={JSON.stringify(appData)}
                columnsConfig={columnsConfig2}
                rowsData={appData}
                checkboxSelection={false}
                // onRowClick={handleRowClick}
                headerTextBackground="white"
                headerBackground="var(--blue-menu)"
              />
              </div>
            ) : (
              <p className="text-gray-500 text-sm pl-6">Aucun contrôle disponible</p>
            )

          ): (
              <div className = "flex-1  transition-all">
            <Tabs
              color = "success"
              aria-label="Control Tabs"
        defaultValue={0}
        onChange={handleTabChange}
        sx={{
          "--Tabs-spacing": "0px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          backgroundColor: "white",
          width: "100%",
        }}
            >
        <TabList
          sx={{

            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f9fafb",
            padding: "0.5rem 0",
            "& .MuiTab-root": {
              fontWeight: "600",
              textTransform: "capitalize",
              padding: "10px 20px",
              borderRadius: "8px 8px 0 0",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#e0f2fe",
                color: "#1e40af",
              },
              "&[aria-selected='true']": {
                backgroundColor: "#dbeafe",
                color: "#1e40af",
                borderBottom: "2px solid #1e40af",
              },
            },
          }}
        >
          <Tab disableIndicator>Exécuter</Tab>
          <Tab disableIndicator>Corriger</Tab>
        </TabList>

        <div className="bg-white py-4 rounded-b-lg">
          <TabPanel value={0} sx={{ padding: 0 }}>
            {loading ? (
              <p className="text-gray-500 text-sm pl-6">Chargement...</p>
            ) : appData.length > 0 ? (
              <div className="flex-1 overflow-x-auto overflow-y-auto transition-all">
                <Table
                  key={JSON.stringify(appData)}
                  columnsConfig={columnsConfig2}
                  rowsData={appData}
                  checkboxSelection={false}
                  // onRowClick={handleRowClick}
                  headerTextBackground="white"
                  headerBackground="var(--blue-menu)"
                />
                </div>
            ) : (
              <p className="text-gray-500 text-sm pl-6">Aucun contrôle disponible</p>
            )}
          </TabPanel>

          <TabPanel value={1} sx={{ padding: 0 }}>
            {loading ? (
              <p className="text-gray-500 text-sm pl-6">Chargement...</p>
            ) : correctionExecution.length > 0 ? (
              <div className="flex-1 overflow-x-auto overflow-y-auto transition-all">
              <Table
                key={JSON.stringify(correctionExecution)}
                columnsConfig={columnsConfig2}
                rowsData={correctionExecution}
                checkboxSelection={false}
                // onRowClick={handleRowClick}
                headerTextBackground="white"
                headerBackground="var(--blue-menu)"
              />
              </div>
            ) : (
              <p className="text-gray-500 text-sm pl-6">Aucun contrôle disponible</p>
            )}
          </TabPanel>
        </div>
      </Tabs>
    </div>
  )
}
       
      </div >
    </div >
  );
}

export default DisplayControleAppID;