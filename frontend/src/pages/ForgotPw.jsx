import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepEmailForm from "./subPages/StepEmailForm";
import StepVerificationCode from "./subPages/StepVerificationCode";
import StepNewPassword from "./subPages/StepNewPassword";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import useAuth from "../Hooks/useAuth"; // Import du hook useAuth
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ForgotPw() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [expirationTime, setExpirationTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // État pour gérer les erreurs
  const [otp, setOtp] = useState("");

  const { checkEmail, loading } = useAuth(); // Récupérer la fonction `checkEmail`

  // Fonction pour vérifier l'email et passer à l'étape suivante
  const handleCheckEmail = async (code, email) => { // Ajout de `code`
    setErrorMessage(""); 
    try {
      const body = { email };
      const response = await checkEmail(body);
  
      if (response.success) {
        setEmail(email);
        setVerificationCode(code); // Stocke le code généré
        const data = { email, code };
          setStep(2);
        
      } else {
        setErrorMessage(response.error || "Email non trouvé. Veuillez réessayer.");
      }
    } catch (error) {
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
      console.error("Erreur :", error);
    }
  };
  

  const handleSetExpirationTime = (time) => {
    setExpirationTime(time);
  };

  // Gestion des étapes du formulaire
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <StepEmailForm
            onNext={handleCheckEmail}
            onSetExpirationTime={handleSetExpirationTime}
            loading={loading}
            errorMessage={errorMessage} // Passer l'erreur à l'étape 1
          />
        );
      case 2:
        return (
          <StepVerificationCode
            verificationCode={verificationCode}
            email={email}
            expirationTime={expirationTime}
            onNext={() => {
              
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        const infos={
          firstconnection:false,
          email:email
        }
        return <StepNewPassword infos={infos} onBack={() => setStep(2)} />;
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
