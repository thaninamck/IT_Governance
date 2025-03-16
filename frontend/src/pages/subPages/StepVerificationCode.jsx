import React, { useEffect, useState } from "react";
import OTPInput from "../../components/OTPInput";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function StepVerificationCode({ onNext, onBack, verificationCode, email, expirationTime }) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(expirationTime ? expirationTime - Date.now() : 0);
  const [errorMessage, setErrorMessage] = useState(""); // Gérer l'affichage des erreurs
  const { verifyCode, loading } = useAuth();
  useEffect(() => {
    if (!expirationTime) return;

    const interval = setInterval(() => {
      const remainingTime = expirationTime - Date.now();
      setTimeLeft(remainingTime > 0 ? remainingTime : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime]);

  const handleOTPSubmit = async () => {
    if (timeLeft <= 0) {
      setErrorMessage("Code expiré, veuillez demander un nouveau code.");
      return;
    }
  
    try {
      setErrorMessage(""); // Réinitialiser les erreurs avant la requête
  const body={
    email,code:otp
  }
  console.log(body);
      const response = await verifyCode(body);
  
      if (response.success) {
        toast.success("Code validé avec success!");
        onNext(); 
      } else {
        setErrorMessage(response.error || "Code incorrect. Réessayez.");
      }
    } catch (error) {
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
    }
  };
  

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="mx-6">
      <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col w-1/2 justify-self-center items-center">
      <OTPInput length={4} onChange={(code) => setOtp(code)} onOTPSubmit={handleOTPSubmit} email={email} />

        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

        {timeLeft > 0 ? (
          <p className="text-red-500 text-sm mt-2">
            Expire dans {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </p>
        ) : (
          <button
            onClick={onBack}
            className="text-[var(--blue-menu)] text-sm mt-2 border-none hover:underline"
          >
            Code expiré ? Demander un nouveau code
          </button>
        )}
      </div>
    </div>
  );
}

export default StepVerificationCode;
