import React, { useState } from 'react';
import ControlModalWindow from './ControlModalWindow';
import RiskModalWindow from './RiskModalWindow';
const Test = () => {
  
    const [isOpen, setIsOpen] = useState(false);

    const openWindow = () => {
      setIsOpen(true);
    };
  
    const infosCntrl = {
        Code: "32",
        Type:  [  1,  'préventif' ],
          
        
        CntrlDescription: "Description du contrôle",
        TestScript: "Test script du contrôle",
        Sources: [
          [  1,  'Source 1' ],
          [  2,  'Source 2' ],
        ],


        MajorProcess: {
          Code: "MP32",
          Designation: "Processus majeur"
        },
        SubProcess: {
          Code: "SP32",
          Designation: "Sous-processus"
        }
      };

      const infosRisk = {
        Code: "32",
        Nom: "Nom du risque",
        Description: "Description du risque"
      };
      
    const closeWindow = () => {
      setIsOpen(false);
    };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      {/* Bouton pour ouvrir la modale */}
      <button
        className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700"
        onClick={openWindow}
      >
        Ouvrir la fenêtre modale
      </button>

         {isOpen && <ControlModalWindow isOpen={isOpen} onClose={closeWindow} infosCntrl={infosCntrl} />} 
      {/*isOpen && <RiskModalWindow isOpen={isOpen} onClose={closeWindow} infosRisk={infosRisk} />*/}
        
      
    </div>
  );
};

export default Test;
