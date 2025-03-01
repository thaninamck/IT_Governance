import { useState } from 'react'
import PopUp from './components/PopUps/PopUp';
import DecisionPopUp from './components/PopUps/DecisionPopUp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './App.css'
import './index.css'
import InsertionPopUp from './components/PopUps/InsertionPopUp';
import SideBar from './components/sideBar/SideBar';
import Header from './components/Header/Header';
import HeaderBis from './components/Header/HeaderBis';
import NotificationBar from './components/Notification/NotificationBar';
import NotificationPopup from './components/Notification/NotificationPopup';
import InputForm from './components/Forms/InputForm';
import AppForm from './components/Forms/AppForm';
import Remediation from './components/Forms/Remediation';
import SuiviRemForm from './components/Forms/SuiviRemForm';
import AddClientForm from './components/Forms/AddClientForm';
import AddMissionForm from './components/Forms/AddMissionForm';
import AddUserForm from './components/Forms/AddUserForm';
import Table from './components/Table';
import SingleOptionSelect from './components/Selects/SingleOptionSelect';
import MultiOptionSelect from './components/Selects/MultiOptionSelect';
import MissionInfo from './components/InfosDisplay/MissionInfo';

import StatusMission from './components/StatusMission';
import MissionDetail from './pages/Manager/MissionDetail';
import { BreadcrumbProvider } from './Context/BreadcrumbContext';
import Breadcrumbs from './components/Breadcrumbs';
import PasswordChange from './components/Forms/PasswordChange';
import AddCoucheForm from './components/Forms/DynamicAddForm';
import AddCategorieForm from './components/Forms/AddCategorieForm';
import OTPPage from './components/OTPPage';
import HeaderSettings from './components/Header/HeaderSettings';
import SearchBar from './components/SearchBar';
import EvidenceList from './components/Evidences/EvidenceList';
import Separator from './components/Decorators/Separator';
import Test from './components/ModalWindows/Test';
import ModalWindow from './components/ModalWindows/ControlModalWindow';
import SignUpForm from './components/Forms/SignUpForm';
import Login from './pages/Login';
import Notification from './pages/Notification';
import ChangePassword from './pages/ChangePassword';
import AdminHomePage from './pages/AdminHomePage';

import MyProfile from './pages/MyProfile';
import GestionMission from './pages/GestionMission';
import GestionClient from './pages/GestionClient';
import Settings from './pages/Settings';
import AddRisqueForm from './components/Forms/AddRisqueForm';
import ManageControls from './pages/ManageControls';
import GestionUtilisateur from './pages/GestionUtilisateur';
import Flow from './components/workPlan/Flow';
import Accordion from './components/workPlan/WorkPlanSideBar';
import Workplan from './pages/Manager/Workplan';
import WorkPlanSideBar from './components/workPlan/WorkPlanSideBar';
import ControleExcutionPage from './pages/Testeur/ControleExcutionPage';
import RemediationActionId from './pages/Testeur/RemediationActionId';
import ListControle from './pages/Testeur/ListControle';
import ForgotPw from './pages/ForgotPw';
import StepEmailForm from './pages/subPages/StepEmailForm';
import StepVerificationCode from './pages/subPages/StepVerificationCode';
import StepNewPassword from './pages/subPages/StepNewPassword';
import ChangePasswordAfterFirstLogin from './pages/ChangePasswordAfterFirstLogin';
import MissionReport from './pages/Manager/MissionReport';
import AppReport from './pages/Manager/AppReport';
function App() {
  const getRowLink = (row) => `/tablemission/${row.mission}`;
  
  const columnsConfig = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'firstName', headerName: 'First Name', width: 180 },
    { field: 'lastName', headerName: 'Last Name', width: 180 , expandable: true, 
      maxInitialLength: 30 },
    { field: 'age', headerName: 'Age', width: 100 },
    { field: 'status', headerName: 'Status', width: 180 },
    { field: 'rapport', headerName: 'View Report', width: 180 },
    { field: 'actions', headerName: 'Actions', width: 180 }
];
const location = useLocation();

// Liste des chemins où Breadcrumbs doit être affiché
const breadcrumbRoutes = [
  "/rapportmission", // Ajout pour la page principale
 "/rapportmission/:missionName", // Ajout pour une mission spécifique
  "/tablemission",
  "/missionInfo",
  "/statusmission",
  "/table",
  "/tableApp"
];
 /* const statuses = [
    [1, 'Applied'],
    [2, 'Not applied'],
    [3, 'NA'],
  ];

  const layers = [
    [1, 'Os'],
    [2, 'Bdd'],
    [3, 'NA'],
  ];*/

const rowsData = [
    { id: 1, firstName: 'Jon', lastName: 'Ceci est une longue description pour la cellule extensible Ceci est une longue description pour la cellule extensible Ceci est une longue description pour la cellule extensible  ', age: 35, status: 'Active' },
    { id: 2, firstName: 'Cersei', lastName: 'Lannister', age: 42, status: 'Inactive' },
  
];

const columnsConfig2 = [
  
  { field: 'statusMission', headerName: 'Status', width: 180 },
  { field: 'mission', headerName: 'Mission', width: 180 },
  { field: 'client', headerName: 'Client', width: 180 },
  { field: 'role', headerName: 'Role', width: 180 },
  { field: 'actions', headerName: 'Actions', width: 80 },
];

const rowsData2 = [
  { id: 1, statusMission: 'en_cours', mission: 'DSP', client: 'Djeezy', role: 'Manager' },
  { id: 2, statusMission: 'terminee', mission: 'DSP1', client: 'Oredoo', role: 'Testeur' },
  { id: 3, statusMission: 'non_commencee', mission: 'DSP2', client: 'Mazars', role: 'Testeur' },
  { id: 4, statusMission: 'en_retard', mission: 'DSP3', client: 'Djeezy', role: 'Superviseur' },
  // Ajoute d'autres lignes avec des ids uniques
];

const columnsConfig3 = [
  
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'app', headerName: 'Application', width: 180 },
  { field: 'couche', headerName: 'Couche', width: 180 },
  { field: 'actions', headerName: 'Actions', width: 80 },
];

const rowsData3 = [
  { id: 1, app: 'New SNOC', couche: 'APP'},
  { id: 2, app: 'USSD', couche: 'OS'},
  { id: 3, app: 'CV360°', couche: 'BDD'},
  // Ajoute d'autres lignes avec des ids uniques
];



  return (
    <>
    
       <div className="App">
        <BreadcrumbProvider>
      {/* Afficher Breadcrumbs uniquement si le chemin est dans la liste 
       {breadcrumbRoutes.some(route => location.pathname.startsWith(route)) && <Breadcrumbs />}*/}
        <Routes>
        { /*-----------------Popup-----------------------------*/  }
          <Route path='/popup' element={<PopUp redirectionURL={'#'} text={'mission crée'}/>}/>
          <Route path='/decisionpopup' element={<DecisionPopUp confirmURL={'#'} denyURL={'#'} text={'etes vous sure de vouloir supprimer la mission?'}/>}/>
          <Route path='/insertionpopup' element={<InsertionPopUp value={50} finishingURL={'#'}/>}/>
          <Route path='/popup' element={<PopUp/>}/>
          <Route path='/sep' element={<Separator/>}/>
          <Route path='/sideBar' element={<SideBar userRole="admin"/>}/>
          <Route path='/searchBar' element={<SearchBar/>}/>

          <Route path='/header' element={<Header/>}/>
          <Route path='/headerbis' element={<HeaderBis/>}/>
          <Route path='/headersettings' element={<HeaderSettings/>}/>

        
          <Route path='/notificationpopup' element={<NotificationPopup/>}/>

          { /*-----------------Forms-----------------------------*/  }
          <Route path='/inputform' element={<InputForm/>}/>
          <Route path='/appform' element={<AppForm title="Ajouter une nouvelle application" />}/>
          <Route path='/remediationForm' element={<Remediation title="Ajouter une Remédiation" />}/>
          <Route path='/suiviRemForm' element={<SuiviRemForm title="Ajouter une Remédiation" />}/>
          <Route path='/addclientForm' element={<AddClientForm title="Ajouter un nouveau client" />}/>
          <Route path='/addmissionForm' element={<AddMissionForm title="Ajouter une mission" />}/>
          <Route path='/adduserForm' element={<AddUserForm title="Ajouter un nouveau utilisateur" />}/> 
          <Route path='/addrisqueForm' element={<AddRisqueForm title="Ajouter un nouveau risque" />}/> 
          <Route path='/changePWForm' element={<PasswordChange title="Changer mon mot de passe" />}/>
          <Route path="/coucheForm" element={<AddCoucheForm  title="" />} /> 
          <Route path="/categorieForm" element={<AddCategorieForm title="" />} />
          <Route path="/otp" element={<OTPPage/>} />
          <Route path="/signupForm" element={<SignUpForm title="Forvis Mazars" />} />

          { /*-----------------tables-----------------------------*/  }
          <Route path='/table' element={<Table  columnsConfig={columnsConfig} rowsData={rowsData}   checkboxSelection={true} /> }/>    
          <Route path='/tablemission' element={<Table  columnsConfig={columnsConfig2} rowsData={rowsData2}   checkboxSelection={false}  getRowLink={getRowLink} /> }/>  
          <Route path='/tableApp' element={<Table  columnsConfig={columnsConfig3} rowsData={rowsData3}   checkboxSelection={false} /> }/> 


          <Route path='/missionInfo' element={<MissionInfo/>}/>
          <Route path='/statusmission' element={<StatusMission  status="en_cours"/>}/>
          <Route path='/test' element={<Test/>}></Route>
          <Route path='/win' element={<ModalWindow  />}></Route>
          
         
          
          <Route path="/tablemission/:mission" element={<MissionDetail />} />

          {/*----------------------------Pages-------------------*/}
          <Route path='/notification' element={<Notification/>}/>
          <Route path='/changePw' element={<ChangePassword/>}/>
          <Route path='/adminHomePage' element={<AdminHomePage/>}/>
          <Route path='/controlsManager' element={<ManageControls/>}/>
          <Route path='/login' element={<Login  />}></Route>
          <Route path='/myprofile' element={<MyProfile/>}></Route>
          <Route path='/missions' element={<GestionMission/>}></Route>

          <Route path='/utilisateurs' element={<GestionUtilisateur/>}></Route>
          <Route path='/clients' element={<GestionClient/>}></Route>
          <Route path='/settings' element={<Settings/>}></Route>
          <Route path='/controle/:code' element={<ControleExcutionPage/>}></Route>
          <Route path='/remediation/:id' element={<RemediationActionId/>}></Route>
          <Route path='/listcontrole' element={<ListControle/>}></Route>
          <Route path='/pw' element={<ForgotPw/>}></Route>
          <Route path='/stepEmailForm' element={<StepEmailForm/>}></Route>
          <Route path='/stepVerificationCode' element={<StepVerificationCode/>}></Route>
          <Route path='/stepNewPassword' element={<StepNewPassword/>}></Route>
          <Route path='/firstconnection' element={<ChangePasswordAfterFirstLogin/>}></Route>

          <Route path='/flow' element={<Flow/>}></Route>

          <Route path='/acc' element={<WorkPlanSideBar/>}></Route>
          <Route path='/workplan' element={<Workplan/>}></Route>
          <Route path='/missions/:mission' element={<MissionReport/>}></Route>
          <Route path='/missions/:mission/:app' element={<AppReport/>}></Route>
          <Route path='/apprep' element={<AppReport/>}></Route>

         
          
          
          
        </Routes>
        </BreadcrumbProvider>
        
       </div>
      
      
    </>

  )
}

export default App
