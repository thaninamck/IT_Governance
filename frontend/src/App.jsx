import { useState } from 'react'
import PopUp from './components/PopUps/PopUp';
import DecisionPopUp from './components/PopUps/DecisionPopUp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  
  const columnsConfig = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'firstName', headerName: 'First Name', width: 180 },
    { field: 'lastName', headerName: 'Last Name', width: 180 },
    { field: 'age', headerName: 'Age', width: 100 },
    { field: 'status', headerName: 'Status', width: 180 },
    { field: 'rapport', headerName: 'View Report', width: 180 },
    { field: 'actions', headerName: 'Actions', width: 180 }
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
    { id: 1, firstName: 'Jon', lastName: 'Snow', age: 35, status: 'Active' },
    { id: 2, firstName: 'Cersei', lastName: 'Lannister', age: 42, status: 'Inactive' },
  
];

const columnsConfig2 = [
  
  { field: 'status', headerName: 'Status', width: 180 },
  { field: 'mission', headerName: 'Mission', width: 180 },
  { field: 'client', headerName: 'Client', width: 180 },
  { field: 'role', headerName: 'Role', width: 180 },
  { field: 'actions', headerName: 'Actions', width: 180 },
];

const rowsData2 = [
  { id: 1, status: 'Active', mission: 'DSP', client: 'Djeezy', role: 'Manager' },
  { id: 2, status: 'Active', mission: 'DSP', client: 'Djeezy', role: 'Manager' },
  { id: 3, status: 'Active', mission: 'DSP', client: 'Djeezy', role: 'Manager' },
  // Ajoute d'autres lignes avec des ids uniques
];

const columnsConfig3 = [
  
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'app', headerName: 'Application', width: 180 },
  { field: 'couche', headerName: 'Couche', width: 180 },
  { field: 'actions', headerName: 'Actions', width: 180 },
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
        <Routes>
        { /*-----------------Popup-----------------------------*/  }
          <Route path='/popup' element={<PopUp redirectionURL={'#'} text={'mission crée'}/>}/>
          <Route path='/decisionpopup' element={<DecisionPopUp confirmURL={'#'} denyURL={'#'} text={'etes vous sure de vouloir supprimer la mission?'}/>}/>
          <Route path='/insertionpopup' element={<InsertionPopUp value={50} finishingURL={'#'}/>}/>
          <Route path='/popup' element={<PopUp/>}/>

          <Route path='/sideBar' element={<SideBar userRole="testeur"/>}/>
          
          <Route path='/header' element={<Header/>}/>
          <Route path='/headerbis' element={<HeaderBis/>}/>

          <Route path='/notification' element={<NotificationBar/>}/>
          <Route path='/notificationpopup' element={<NotificationPopup/>}/>

          { /*-----------------Forms-----------------------------*/  }
          <Route path='/inputform' element={<InputForm/>}/>
          <Route path='/appform' element={<AppForm title="Ajouter une nouvelle application" />}/>
          <Route path='/remediationForm' element={<Remediation title="Ajouter une Remédiation" />}/>
          <Route path='/suiviRemForm' element={<SuiviRemForm title="Ajouter une Remédiation" />}/>
          <Route path='/addclientForm' element={<AddClientForm title="Ajouter un nouveau client" />}/>
          <Route path='/addmissionForm' element={<AddMissionForm title="Ajouter une mission" />}/>
          <Route path='/adduserForm' element={<AddUserForm title="Ajouter un nouveau utilisateur" />}/> 

          { /*-----------------tables-----------------------------*/  }
          <Route path='/table' element={<Table  columnsConfig={columnsConfig} rowsData={rowsData}   checkboxSelection={true} /> }/>    
          <Route path='/tablemission' element={<Table  columnsConfig={columnsConfig2} rowsData={rowsData2}   checkboxSelection={false} /> }/>  
          <Route path='/tableApp' element={<Table  columnsConfig={columnsConfig3} rowsData={rowsData3}   checkboxSelection={false} /> }/> 

                
          
          <Route path='/missionInfo' element={<MissionInfo/>}/>
          
          
        </Routes>
        
       </div>
      
    </>

  )
}

export default App
