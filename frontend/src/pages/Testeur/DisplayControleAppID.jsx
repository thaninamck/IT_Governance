import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { PermissionRoleContext } from '../../Context/permissionRoleContext';
import Header from '../../components/Header/Header';
import Breadcrumbs from '../../components/Breadcrumbs';
import AppInfo from '../../components/InfosDisplay/AppInfo';
import Matrix from '../../components/workPlan/Matrix';
import Separator from '../../components/Decorators/Separator';
import SearchBar from '../../components/SearchBar';
import { useAuth } from '../../Context/AuthContext';
import Table from '../../components/Table';
import { api } from '../../Api';
import { useProfile } from '../../Context/ProfileContext';

function DisplayControleAppID() {
  const { profile } = useProfile();
  console.log('profile',profile)
  const navigate = useNavigate()
  const { user} = useAuth();
  const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
 
  console.log("Rôle de l'utilisateur :", user);
  const location = useLocation(); // Obtenir l'URL actuell

  const AppData = location.state?.AppData; // Récupérer les données envoyées
  console.log('appdata',AppData)
  const breadcrumbRoutes = [
    "/missions",
    "/missions/:mission/:nomApp",
    "/tablemission",
    "gestionmission",
    "/rapportmission", // Ajout pour la page principale
    "/rapportmission/:missionName", // Ajout pour une mission spécifique

  ];

  // const [filteredRows, setFilteredRows] = useState(data1);
  const handleSearchResults = (results) => setFilteredRows(results);
  const { mission } = useParams([]); // Récupérer les paramètres de l'URL
  const { name } = useParams([]); // Récupérer les paramètres de l'URL
  console.log("Mission sélectionnée :", mission);
  console.log("App sélectionnée :", name);
  

  const [selectedControl, setSelectedControl] = useState([]);
  const handleRowClick = (rowData) => {
    navigate(`/missions/${mission}/${name}/${rowData.controlCode}`, { state: { controleData: rowData } });
    console.log('Détails du contrôle sélectionné:', rowData);
  };
  const columnsConfig2 = [
    { field: "riskCode", headerName: "risk Code", width: 100,expandable: true },
    { field: "riskDescription", headerName: "risk description", width: 200 ,expandable: true},
    { field: "controlCode", headerName: "controle Code", width: 100 ,expandable: true},
    { field: "controlDescription", headerName: "description", width: 170 ,expandable: true},
    { field: "executionControlOwner", headerName: "owner", width: 150,expandable: true },
    { field: "layerName", headerName: "couche", width: 150 ,expandable: true},
    { field: "etat", headerName: "Etat", width: 150 ,expandable: true},
    { field: "statusName", headerName: "status", width: 150,expandable: true },
    { field: "userFullName", headerName: "testeur", width: 150 ,expandable: true},
    { field: "remediation", headerName: "Remédiation", width: 150 ,expandable: true},
    { field: "Lancer",
       headerName: "Lancer",
        width: 115 ,
        customRenderCell: (params) => {
          return (
            <button 
           // onClick={() =>  navigate(`/missions/${mission}/${name}/${rowData.controlCode}`, { state: { controleData: rowData } })}
            className=" flex items-center bg-green-500  hover:bg-green-600 text-white font-semibold  border-none h-[40px] px-5 rounded shadow">
              Exécuter
            </button>
          );
        },

      },
  ];

const [appData, setAppData] = useState([]); // État pour stocker les données de l'application
 const fetchAppData = async () => {
  setLoading(true); 
  try {
   console.log('profileme',AppData.profile);
  
   console.log('role',AppData.role);
    const endpoint = (AppData.role === "admin"||AppData.profile ==='manager' ) ? 
    `/missions/${AppData.id}/getexecutionsList` :
     `/missions/${AppData.missionId}/${AppData.id}/getexecutionsListForTesteur`;
    const response = await api.get(endpoint);
    console.log('list',response.data)
    setAppData(response.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  if (user?.role && profile) {
    fetchAppData();
  }
}, [user, profile]);


// const fetchAppData = async () => {
//     try {
//       const response = await api.get(`/missions/${AppData.missionId}/${AppData.id}/getexecutionsListForTesteur`);
//       console.log('list',AppData.missionId)
//       setAppData(response.data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
 // Chargement initial
 useEffect(() => {
  if (AppData.id) {
    fetchAppData();
  }
  
}, [AppData.id]);
useEffect(() => {
  console.log("appData:", appData);
}, [appData]);


  return (
    <div className=" ">

      <Header user={user} />
      <div className=" ml-5 mr-6 pb-9">
        {/* Afficher Breadcrumbs uniquement si le chemin correspond */}
        {breadcrumbRoutes.some((route) =>
          location.pathname.startsWith(route)
        ) && <Breadcrumbs />}
        <AppInfo 
       // dataFormat={AppData}
        appId={AppData.id} />
        {/* <div className="flex items-center justify-center mb-6">
          <SearchBar
            columnsConfig={''}
            initialRows={data1}
            onSearch={handleSearchResults}
          />
        </div> */}
        <Separator text='List des Controles' />
        {console.log("Données passées à Matrix:", { applications: [{ ...appData }] })}
        <div
          className="flex-1 overflow-x-auto overflow-y-auto h-[400px] transition-all "
        >
          
        {AppData ? (
          // <Matrix
          //   data={{ applications: [{ ...appData, controls }] }}
          //   user={user}
          //   onRowClick={handleRowClick}
          // />
         
          <Table
          key={JSON.stringify(appData)}
          columnsConfig={columnsConfig2}
          rowsData={appData}
          checkboxSelection={false}    
             onRowClick={handleRowClick}
              headerTextBackground={"white"}
              headerBackground="var(--blue-menu)"
          />
        ) : (
          <p className='text-[var(--status-gray)] text-s pl-6'>Aucun contrôle disponible</p>
        )}
        </div>
      </div>

    </div>
  )
}

export default DisplayControleAppID