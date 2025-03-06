import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { PermissionRoleContext } from '../../Context/permissionRoleContext';
import Header from '../../components/Header/Header';
import Breadcrumbs from '../../components/Breadcrumbs';
import AppInfo from '../../components/InfosDisplay/AppInfo';
import Matrix from '../../components/workPlan/Matrix';
import Separator from '../../components/Decorators/Separator';
import SearchBar from '../../components/SearchBar';

function DisplayControleAppID() {
  const navigate = useNavigate()
  const { userRole, setUserRole } = useContext(PermissionRoleContext);
  console.log("Rôle de l'utilisateur :", userRole);
  const location = useLocation(); // Obtenir l'URL actuell
  const AppData = location.state?.AppData; // Récupérer les données envoyées
  const breadcrumbRoutes = [
    "/Missions",
    "/tablemission",
    "gestionmission",
    "/rapportmission", // Ajout pour la page principale
    "/rapportmission/:missionName", // Ajout pour une mission spécifique

  ];

  // const [filteredRows, setFilteredRows] = useState(data1);
  const handleSearchResults = (results) => setFilteredRows(results);
  const { mission } = useParams([]); // Récupérer les paramètres de l'URL
  const { nomApp } = useParams([]); // Récupérer les paramètres de l'URL
  console.log("Mission sélectionnée :", mission);
  console.log("App sélectionnée :", nomApp);
  const [appData, setAppData] = useState(null);

  const handleRowClick = (rowData) => {
    // Naviguer vers la page de détails avec l'ID du contrôle dans l'URL
    navigate(`/tablemission/${mission}/${nomApp}/${rowData.controlCode}`, { state: { controleData: rowData } });
    // navigate('/controle', { state: { controleData: rowData } });
    console.log('Détails du contrôle sélectionné:', rowData);
  };


  // Simuler la récupération des données de l'application
  useEffect(() => {
    const fetchAppData = () => {
      // Exemple de données statiques (remplacez par un appel API)
      const data = {
        applications: [
          {
            id: "app1",
            description: "USSD",
            layers: [
              {
                id: "l1",
                name: "OS",
                risks: [
                  {
                    id: "1",
                    nom: "SDLC requirements are not exist or are not conducted.",
                    description:
                      "furfuzirfyzuf iuzyfoz ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof",
                    owner: "sisi",
                    controls: [
                      {
                        id: "4",
                        description:
                          "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification...",
                        majorProcess: "Technical",
                        subProcess: "Access control",
                        type:"detectif",
                        testScript:
                          "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
                        owner: "titi",
                      },
                    ],
                  },
                ],
              },
              {
                id: "l1",
                name: "DB",
                risks: [
                  {
                    id: "2",
                    nom: "SDLC1 requirements are not exist or are not conducted.",
                    description:
                      "furfuzirfyzuf iuzyfoz ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof",
                    owner: "TEST",
                    controls: [
                      {
                        id: "4",
                        description:
                          "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification...",
                        majorProcess: "Technical",
                        subProcess: "Access control",
                        type:"detectif",
                        testScript:
                          "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
                        owner: "mimi",
                      },
                    ],
                  },
                ],
              },
    
            ],
            owner: "",
          },
    
          {
            id: "app2",
            description: "New SNOC",
            layers: [
              {
                id: "l1",
                name: "app",
                risks: [
                  {
                    id: "5",
                    nom: "SDLCppppppp requirements are not exist or are not conducted.",
                    description:
                      "ttttttttttttttttt ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof",
                    owner: "sisi 3",
                    controls: [
                      {
                        id: "1",
                        description:
                          "Duties 212and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification...",
                        majorProcess: "Technical",
                        subProcess: "Access control",
                        type:"detectif",
                        testScript:
                          "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
                        owner: "titi",
                      },
                    ],
                  },
                ],
              },
              {
                id: "l4",
                name: "DB",
                risks: [
                  {
                    id: "2",
                    nom: "SDLC1 requirements are not exist or are not conducted.",
                    description:
                      "furfuzirfyzuf iuzyfoz ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof",
                    owner: "TEST",
                    controls: [
                      {
                        id: "8",
                        description:
                          "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification...",
                        majorProcess: "Technical",
                        subProcess: "Access control",
                        type:"correctif",
                        testScript:
                          "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
                        owner: "mimi",
                      },
                    ],
                  },
                ],
              },
              {
                id: "3",
                name: "OS",
                risks: [
                  {
                    id: "6",
                    nom: " requirements are not exist or are not conducted.",
                    description:
                      "furfuzirfyzuf iuzyfoz ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof",
                    owner: "sisi 3",
                    controls: [
                      {
                        id: "9",
                        description:
                          "Duties  of responsibility are separated, in order to reduce opportunities for unauthorized modification...",
                        majorProcess: "Technical",
                        subProcess: "Access control",
                        type:"detectif",
                        testScript:
                          "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
                        owner: "AAA",
                      },
                    ],
                  },
                ],
              },
    
            ],
            owner: "",
          },
        ]
    
      };

      // Trouver l'application correspondante
      const selectedApp = data.applications.find(
        (app) => nomApp === app.description
      );
  
      setAppData(selectedApp);

      console.log('app', selectedApp)
    };

console.log('Appdata',AppData)
    fetchAppData();
  }, [AppData, nomApp]);

  //  if (!appData) {
  //     return <div>Chargement...</div>;
  //   }


 // Extraire les contrôles de l'application
 const controls = appData
 console.log('appData',appData)
 ? appData.layers
     .flatMap((layer) => layer.risks || []) // Vérifier si layer.risks existe
     .flatMap((risk) => risk.controls || []) // Vérifier si risk.controls existe
 : [];

  return (
    <div className=" ">

      <Header />
      <div className=" ml-5 mr-6 pb-9">
        {/* Afficher Breadcrumbs uniquement si le chemin correspond */}
        {breadcrumbRoutes.some((route) =>
          location.pathname.startsWith(route)
        ) && <Breadcrumbs />}
        <AppInfo dataFormat={AppData} />
        {/* <div className="flex items-center justify-center mb-6">
          <SearchBar
            columnsConfig={''}
            initialRows={data1}
            onSearch={handleSearchResults}
          />
        </div> */}
        <Separator text='List des Controles' />
        {console.log("Données passées à Matrix:", { applications: [{ ...appData }] })}
        {appData ? (
          <Matrix
            data={{ applications: [{ ...appData, controls }] }}
            userRole={userRole}
            onRowClick={handleRowClick}
          />
        ) : (
          <p className='text-[var(--status-gray)] text-s pl-6'>Aucun contrôle disponible</p>
        )}
      </div>

    </div>
  )
}

export default DisplayControleAppID