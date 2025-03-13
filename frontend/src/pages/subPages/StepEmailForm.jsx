import React, { useState } from "react";
import LockResetIcon from "@mui/icons-material/LockReset";
import InputForm from "../../components/Forms/InputForm";
import emailjs from "emailjs-com";
function StepEmailForm({ onNext, onSetExpirationTime, loading, errorMessage }) {
  const [email, setEmail] = useState("");

  return (
    <div className="mx-6">
      <div className="bg-white rounded-lg shadow-lg px-12 flex flex-col items-center gap-8 py-12">
        <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-[var(--blue-menu)] text-center">
          Mot de passe oublié ?
        </h1>

        <p className="text-gray-600 text-center">
          Entrez votre adresse email pour recevoir un code de vérification.
        </p>

        <InputForm
          type="email"
          label="Email"
          placeholder="Votre adresse email"
          width="450px"
          flexDirection="flex-col"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Affichage du message d'erreur en rouge */}
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <button
          className="w-[41%] border-none bg-[var(--blue-conf)] hover:bg-[var(--blue-menu)] text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out text-sm md:text-base lg:text-lg"
          onClick={() => onNext(email)}
          disabled={loading}
        >
          {loading ? "Envoi en cours..." : "Envoyer le code"}
        </button>
      </div>
    </div>
  );
}

export default StepEmailForm;
