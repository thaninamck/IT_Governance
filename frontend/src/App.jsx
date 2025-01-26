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
import SingleOptionSelect from './components/Selects/SingleOptionSelect';
import MultiOptionSelect from './components/Selects/MultiOptionSelect';
import MissionInfo from './components/InfosDisplay/MissionInfo';
import FileUploader from './components/FileUploader';
function App() {
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

  return (
    <>
    
       <div className="App">
        <Routes>
          
          <Route path='/popup' element={<PopUp redirectionURL={'#'} text={'mission crée'}/>}/>
          <Route path='/decisionpopup' element={<DecisionPopUp confirmURL={'#'} denyURL={'#'} text={'etes vous sure de vouloir supprimer la mission?'}/>}/>
          <Route path='/insertionpopup' element={<InsertionPopUp value={50} finishingURL={'#'}/>}/>
          <Route path='/popup' element={<PopUp/>}/>
          <Route path='/sideBar' element={<SideBar userRole="admin"/>}/>
          <Route path='/header' element={<Header/>}/>
          <Route path='/headerbis' element={<HeaderBis/>}/>
          <Route path='/notification' element={<NotificationBar/>}/>
          <Route path='/notificationpopup' element={<NotificationPopup/>}/>
          <Route path='/inputform' element={<InputForm/>}/>
          <Route path='/appform' element={<AppForm title="Ajouter une nouvelle application" />}/>
          <Route path='/remediationForm' element={<Remediation title="Ajouter une Remédiation" />}/>
          <Route path='/suiviRemForm' element={<SuiviRemForm title="Ajouter une Remédiation" />}/>
          <Route path='/addclientForm' element={<AddClientForm title="Ajouter un nouveau client" />}/>
          <Route path='/addmissionForm' element={<AddMissionForm title="Ajouter une mission" />}/>
          <Route path='/adduserForm' element={<AddUserForm title="Ajouter un nouveau utilisateur" />}/>          
          
          <Route path='/missionInfo' element={<MissionInfo/>}/>
          
          
          
        </Routes>
        
       </div>
      
    </>

  )
}

export default App
