import React, { useState, useRef } from "react";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

function OTPInput({ length = 4, onOTPSubmit,email,onChange }) {
    const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  // Gestion de la saisie
  const handleChange = (index, event) => {
    const value = event.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Prend uniquement le dernier chiffre saisi
    setOtp(newOtp);

    // Passe au champ suivant si un chiffre est saisi
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    onChange(newOtp.join(""));
  };

  // Gestion du retour arrière
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  return (
     <div className="flex flex-col items-center space-y-8">
      <VerifiedUserIcon
            sx={{ color: 'var(--blue-menu)', fontSize: '4rem' }}
          />
      <p className="text-lg font-medium">Veuillez saisir le code de 4 chiffres envoyé à votre email</p>
      <span >{email}</span>
      <div className="flex space-x-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
      <button
         onClick={() => onOTPSubmit(otp.join(""))}
        className="border-none bg-[var(--blue-menu)] hover:bg-[var(--blue-conf)] text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out text-sm md:text-base lg:text-lg"
        >
        Confirmer
      </button>
    </div>
  )
}

export default OTPInput