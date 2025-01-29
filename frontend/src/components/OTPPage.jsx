import React from "react";
import OTPInput from "./OTPInput";


function OTPPage() {
    const handleOTPSubmit = (otp) => {
        console.log("Code saisi :", otp);
      //  alert(`Code saisi : ${otp}`);
        // Ici, tu peux envoyer le code à ton backend pour vérification
      }; 

      

  return (
    <div className="flex items-center justify-center h-screen ">
      
      <OTPInput length={4} onSubmit={handleOTPSubmit} />
    </div>
  )
}

export default OTPPage