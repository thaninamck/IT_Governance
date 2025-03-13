import React, { useState } from "react";
import LockResetIcon from "@mui/icons-material/LockReset";
import InputForm from "../../components/Forms/InputForm";
import emailjs from "emailjs-com";
import useAuth from "../../Hooks/useAuth"; // Import du hook useAuth

function StepEmailForm({ onNext, onSetExpirationTime, errorMessage }) {
  const [email, setEmail] = useState("");
const [interanlerrorMessage, setInternalErrorMessage] = useState(""); // État pour gérer les erreurs
  const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000); // Code à 4 chiffres
  };

  const { storeVerificationCode,loading } = useAuth(); // Import de la fonction

const sendVerificationCode = async () => {
  if(!email){
    setInternalErrorMessage("Veuillez remplir le champ email");
    return;}
  const code = generateCode();
  const expirationTime = Date.now() + 5 * 60 * 1000; // Expiration dans 2 min

  const data = {
    email: email,
    code: code,
  };

  try {
    // D'abord, envoie le code au backend
    console.log(data);
    const response = await storeVerificationCode(data);

    if (!response.success) {
      setInternalErrorMessage("Erreur lors de la génération du code veuillez ressayer")
      return; // Arrêter ici si le stockage échoue
    }

    // Une fois stocké, envoie l'email
    const templateParams = {
      to_email: email,
      from_name: "vs code",
      message: `Votre code de vérification est : ${code}. Il expire dans 2 minutes.`,
    };

    await emailjs.send(
      "service_mcpkn9g", // Service ID
      "template_f4ojiam", // Template ID
      templateParams,
      "oAXuwpg74dQwm0C_s" // User ID
    );

    onSetExpirationTime(expirationTime); // Définit l'heure d'expiration
    onNext(code, email); // Passe le code et l'e-mail à ForgotPw

  } catch (error) {
    console.error("Erreur :", error);
    setInternalErrorMessage("Une erreur est survenue veuillez ressayer")
  }
};


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

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        {interanlerrorMessage && <p className="text-red-500 text-sm">{interanlerrorMessage}</p>}

        <button
          className="w-[41%] border-none bg-[var(--blue-menu)] hover:bg-[var(--blue-conf)] text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out text-sm md:text-base lg:text-lg"
          onClick={sendVerificationCode}
          disabled={loading}
        >
          {loading ? "Envoi en cours..." : "Envoyer le code"}
        </button>
      </div>
    </div>
  );
}

export default StepEmailForm;
