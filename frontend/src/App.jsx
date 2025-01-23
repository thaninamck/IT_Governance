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
import SingleOptionSelect from './components/Selects/SingleOptionSelect';
import MultiOptionSelect from './components/Selects/MultiOptionSelect';
import MissionInfo from './components/InfosDisplay/MissionInfo';
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
          
          <Route path='/missionInfo' element={<MissionInfo/>}/>
          
          
        </Routes>
        
       </div>
      
    </>

  )
}

export default App
