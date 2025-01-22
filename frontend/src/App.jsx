import { useState } from 'react'
import PopUp from './components/PopUp';
import DecisionPopUp from './components/DecisionPopUp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import './index.css'
import InsertionPopUp from './components/InsertionPopUp';
import SideBar from './components/sideBar/SideBar';
import Header from './components/Header/Header';
import HeaderBis from './components/Header/HeaderBis';
import NotificationBar from './components/Notification/NotificationBar';
import NotificationPopup from './components/Notification/NotificationPopup';
function App() {
  

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
          
          
        </Routes>
        
       </div>
      
    </>

  )
}

export default App
