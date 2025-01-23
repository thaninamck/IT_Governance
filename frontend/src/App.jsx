import { useState } from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import './index.css'
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
function App() {
  

  return (
    <>
       <div className="App">
        <Routes>
          
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


          
          
        </Routes>
        
       </div>
      
    </>

  )
}

export default App
