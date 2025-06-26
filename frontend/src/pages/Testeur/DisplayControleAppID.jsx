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
import RevueListExecution from '../Superviseur/RevueListExecution';
import useRevue from '../../Hooks/useRevue';
import { useSystem } from '../../Hooks/useSystem';

function DisplayControleAppID() {
 

  const {
    loading,
    error,
    fetchExecutionsListForApp,
    fetchExecutionsListForCorrection
  } = useExecution();

  const {
  applicationId,setApplicationId,fetchSystemById
  } = useSystem();

 

  const { profile } = useProfile();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const { mission, name } = useParams();
  // const AppData = location.state?.AppData;
  const [AppData, setApplicationData] = useState(location.state?.AppData || null);

  useEffect(() => {
    if (!AppData && (mission && name)) {
      const fetchSystemById = async () => {
        try {
          const res = await api.get(`/missions/${mission}/systems/${name}`);
         
          console.log("Appdata sfetch :", res.data);
          setApplicationData(res?.data);
        } catch (err) {
          console.error("Erreur lors de la récupération de l'application :", err);
        }
      };

      fetchSystemById();
    }
  }, [mission, AppData]);
  console.log("APPDATA applicationid", AppData)
 
  const { fetchRevueExecutionsForApp } = useRevue();
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
    { field: "riskCode", headerName: "Code risque", width: 98, expandable: true },
    { field: "riskDescription", headerName: "Description risque", width: 200, expandable: true },
    { field: "controlCode", headerName: "Code contrôle", width: 100, expandable: true },
    { field: "controlDescription", headerName: "Description contrôle", width: 200, expandable: true },
    { field: "executionControlOwner", headerName: "Propriétaire", width: 120, expandable: true },
    { field: "layerName", headerName: "Couche", width: 100, expandable: true },
    {
      field: "executionEtat",
      headerName: "État d’exécution",
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
    { field: "statusName", headerName: "Statut", width: 130, expandable: true },
    { field: "userFullName", headerName: "Testeur", width: 150, expandable: true },
    {
      field: "Lancer",
      headerName: "Action",
      width: 120,
      customRenderCell: (params) => {
       // console.log('paeamq',params)
        const isToReview = params.row.isToReview;
        const isToValidate = params.row.isToValidate;
        const status = params.row.statusName;
        const remarks = params.row.remarks;
        const launchedAt = params.row.executionLaunchedAt;
        // Vérifie si au moins une remarque a des colonnes non nulles
  const hasValidRemarks = remarks.some(
    (remark) =>
      remark.remark_id !== null ||
      remark.remark_text !== null ||
      remark.remark_y !== null ||
      remark.remark_user_id !== null
  );
    
        let buttonLabel = "Exécuter";
        let buttonColor = "bg-blue-500 hover:bg-blue-600";
    
        if (!isToReview && !isToValidate && hasValidRemarks && launchedAt) {
          buttonLabel = "À corriger";
          buttonColor = "bg-orange-500 hover:bg-orange-600";
        } else if (isToReview && isToValidate && status && launchedAt) {
          buttonLabel = "Valider";
          buttonColor = "bg-green-500 hover:bg-green-600";
        }
       else if (launchedAt) {
        buttonLabel = "Consulter";
        buttonColor = "bg-gray-500 hover:bg-gray-600";
      }
    
        const handleLaunchExecution = async () => {
          try {
            
            const response = await api.put(`missions/${params.row.missionId}/executions/launch-execution/${params.row.id}`);
            console.log('respp launch at',response )
            if (response.status === 200) {
              navigate(`/missions/${mission}/${name}/${params.row.controlCode}`, {
                state: { controleData: params.row },
              });
            } else {
              console.error("Erreur lors du lancement de l'exécution :", response);
            }
          } catch (error) {
            console.error("Exception API lors du lancement :", error);
          }
        };

        const handleClick = () => {
          if (params.row.executionLaunchedAt === null) {
            console.log('launchedAt', params.row.executionLaunchedAt)
            handleLaunchExecution();
          } else {
            navigate(`/missions/${mission}/${name}/${params.row.controlCode}`, {
              state: { controleData: params.row },
            });
          }
        };
        
    
        return (
          <button
        
          onClick={handleClick}
            className={`flex items-center justify-center ${buttonColor} text-white font-semibold border-none h-[40px] w-[100px] rounded shadow`}
          >
           { //params.row.executionLaunchedAt != null ? <span>consulter</span> : 
           buttonLabel}

           
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
        {/* {breadcrumbRoutes.some((route) => location.pathname.startsWith(route)) && <Breadcrumbs />} */}
        <Breadcrumbs items={["Missions",AppData?.missionName || "mission", AppData?.name|| "system"]} />
        <AppInfo appId={AppData?.id} />
        <Separator text="Liste des Contrôles" />
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
          <Tab disableIndicator> À exécuter</Tab>
          <Tab disableIndicator>À corriger</Tab>
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
{/* {
   user?.role === 'admin' &&
    <RevueListExecution  dataFormat={AppData} />

} */}

       
      </div >
    </div >
  );
}

export default DisplayControleAppID;