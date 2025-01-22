import { useState } from 'react'
import PopUp from './components/PopUp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import './index.css'
import SideBar from './components/sideBar/SideBar';
import Header from './components/Header/Header';
import HeaderBis from './components/Header/HeaderBis';
function App() {
  

  return (
    <>
       <div className="App">
        <Routes>
          <Route path='/popup' element={<PopUp/>}/>
          <Route path='/sideBar' element={<SideBar userRole="admin"/>}/>
          <Route path='/header' element={<Header/>}/>
          <Route path='/headerbis' element={<HeaderBis/>}/>
          
          
        </Routes>
        
       </div>
      
    </>

  )
}

export default App
