import { useState } from 'react'
import PopUp from './components/PopUp';
import DecisionPopUp from './components/DecisionPopUp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import './index.css'
import InsertionPopUp from './components/InsertionPopUp';
function App() {
  

  return (
    <>
       <div className="App">
        <Routes>
          <Route path='/popup' element={<PopUp redirectionURL={'#'} text={'mission crée'}/>}/>
          <Route path='/decisionpopup' element={<DecisionPopUp confirmURL={'#'} denyURL={'#'} text={'etes vous sure de vouloir supprimer la mission?'}/>}/>
          <Route path='/insertionpopup' element={<InsertionPopUp value={100} finishingURL={'#'}/>}/>
        </Routes>
        
       </div>
      
    </>

  )
}

export default App
