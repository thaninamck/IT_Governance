import React, { useEffect, useState } from "react";
import OTPInput from "../../components/OTPInput";
function StepVerificationCode({ onNext, onBack, verificationCode, email, expirationTime }) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(expirationTime ? expirationTime - Date.now() : 0);
  const [errorMessage, setErrorMessage] = useState(""); // Gérer l'affichage des erreurs

  useEffect(() => {
    if (!expirationTime) return;

    const interval = setInterval(() => {
      const remainingTime = expirationTime - Date.now();
      setTimeLeft(remainingTime > 0 ? remainingTime : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime]);

  const handleOTPSubmit = () => {
    if (timeLeft <= 0) {
      setErrorMessage("Code expiré, veuillez demander un nouveau code.");
      return;
    }

    if (Number(otp) === Number(verificationCode)) {
      setErrorMessage(""); // Réinitialiser l'erreur
      onNext();
    } else {
      setErrorMessage("Code incorrect. Réessayez.");
    }
  };

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="mx-6">
      <div className="bg-white rounded-lg shadow-lg p-16 flex flex-col items-center">
        <OTPInput length={4} value={otp} onChange={setOtp} onOTPSubmit={handleOTPSubmit} email={email} />

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
