import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/sideBar/SideBar';
import HeaderBis from '../components/Header/HeaderBis';
import OTPInput from '../components/OTPInput';
import PopUp from '../components/PopUps/PopUp';
import { useAuth } from '../Context/AuthContext';

function ChangePassword() {
  const { user} = useAuth();
    const [showPopup, setShowPopup] = useState(false); // État pour afficher le popup
    const [showOtp, setShowOtp] = useState(true); // État pour afficher le popup
    const navigate = useNavigate(); // Hook pour redirection 

    const handleOTPSubmit = (otp) => {
         console.log("Code saisi :", otp);
    // Valider ici le code OTP côté backend
   alert(`Code saisi : ${otp}`);
    setShowOtp(false);
    setShowPopup(true); // Afficher le popup après validation
      }; 

      const handlePopupClose = () => {
        setShowPopup(false); // Masquer le popup
        navigate('/profile'); // Rediriger vers la page Profile
      };

  return (
    <div className="flex ">
      {/* Barre latérale fixe */}
      <SideBar user={user} className=" flex-shrink-0 h-full fixed" />

      {/* Contenu principal défilable */}
      <div className=" flex-1 flex flex-col h-screen overflow-y-auto">
        {/* En-tête */}
        <HeaderBis />
    
        <div className="flex items-center justify-center h-screen ">
      
      {showOtp && <OTPInput length={4} onClick={handleOTPSubmit} />}
      {showPopup &&
      <PopUp text='Mot de passe changé avec succès' redirectionURL={handlePopupClose}/>
    }
    </div>
   
   
    
   
       
      </div>
    </div>
  )
}

export default ChangePassword