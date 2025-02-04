import React, { useState, useRef } from "react";

function OTPInput({ length = 4, onClick }) {
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

    // Soumettre si tous les champs sont remplis
    if (newOtp.every((num) => num !== "")) {
      onSubmit(newOtp.join(""));
    }
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
     <div className="flex flex-col items-center space-y-7">
      <p className="text-lg font-medium">Veuillez saisir le code de 4 chiffres envoyé à votre email</p>
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
        onClick={() => onClick(otp.join(""))}
        className="mt-4 px-6 py-2 bg-[--blue-menu] text-white rounded-md border-none "
      >
        Confirmer
      </button>
    </div>
  )
}

export default OTPInput