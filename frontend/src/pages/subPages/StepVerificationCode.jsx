import React, { useEffect, useState } from "react";
import OTPInput from "../../components/OTPInput";

function StepVerificationCode({ onNext, onBack, verificationCode, email, expirationTime }) {
  const [timeLeft, setTimeLeft] = useState(expirationTime - Date.now()); // Temps restant en ms

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(expirationTime - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime]);

  const handleOTPSubmit = (otpCode) => {
    if (timeLeft <= 0) {
      alert("Code expiré, veuillez demander un nouveau code.");
      return;
    }
    console.log("Code OTP saisi :", otpCode);
    console.log("Code VERF :", verificationCode);
    if (Number(otpCode) === Number(verificationCode)) {
      alert("Code correct !");
      onNext();
    } else {
      alert("Code incorrect. Réessayez.");
    }
  };

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="mx-6">
      <div className="bg-white rounded-lg shadow-lg p-16 flex flex-col items-center">
       
        <OTPInput length={4} onOTPSubmit={handleOTPSubmit} email={email} />

        {timeLeft > 0 ? (
          <p className="text-red-500 text-sm mt-2">
            Expire dans {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </p>
        ) : (
          <button
            onClick={onBack} // Retour à l'étape email pour renvoyer un code
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
