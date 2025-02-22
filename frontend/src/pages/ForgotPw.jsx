import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepEmailForm from "./subPages/StepEmailForm";
import StepVerificationCode from "./subPages/StepVerificationCode";
import StepNewPassword from "./subPages/StepNewPassword";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

function ForgotPw() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [expirationTime, setExpirationTime] = useState(null); // Stocke l'heure d'expiration

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <StepEmailForm
            onNext={(code, email) => {
              setVerificationCode(code);
              setEmail(email);
              setStep(2);
            }}
            onSetExpirationTime={setExpirationTime} // Ajout de la fonction
          />
        );
      case 2:
        return (
          <StepVerificationCode
            verificationCode={verificationCode}
            email={email}
            expirationTime={expirationTime}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)} // Permet de renvoyer un code si expiré
          />
        );
      case 3:
        return <StepNewPassword onBack={() => setStep(2)} />;
      default:
        return <StepEmailForm onNext={() => setStep(2)} />;
    }
  };

  return (
    <div className="bg-gray-50 px-4 h-screen">
      <div onClick={() => navigate("/")}>
        <img src="./mazars_logo.png" alt="Mazars Logo" className="w-28 md:w-36 lg:w-44" />
      </div>
       {/* Bouton retour */}
       <div
        className="absolute top-36 left-14 cursor-pointer flex items-center"
        onClick={() => (step > 1 ? setStep(step - 1) : navigate("/login"))}
      >
        <KeyboardBackspaceIcon className="text-gray-600" />
        <span className="text-gray-600 text-sm hover:underline ml-1">Retour</span>
      </div>

      {renderStepContent()}
    </div>
  );
}

export default ForgotPw;
