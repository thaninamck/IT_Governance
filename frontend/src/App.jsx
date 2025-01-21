import { useState } from 'react'
import PopUp from './components/PopUp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import './index.css'
function App() {
  

  return (
    <>
       <div className="App">
        <Routes>
          <Route path='/popup' element={<PopUp/>}/>
        </Routes>
        
       </div>
      
    </>

  )
}

export default App
