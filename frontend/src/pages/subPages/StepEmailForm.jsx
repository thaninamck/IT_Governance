import React, { useState } from "react";
import InputForm from "../../components/Forms/InputForm";
import emailjs from "emailjs-com";
import useAuth from "../../Hooks/useAuth"; // Import du hook useAuth

function StepEmailForm({ onNext, onSetExpirationTime, errorMessage }) {
  const [email, setEmail] = useState("");
  const [internalErrorMessage, setInternalErrorMessage] = useState(""); // État pour gérer les erreurs

  const generateCode = () => Math.floor(1000 + Math.random() * 9000); // Code à 4 chiffres

  const { storeVerificationCode, loading } = useAuth(); // Import de la fonction

  const sendVerificationCode = async () => {
    if (!email) {
      setInternalErrorMessage("Veuillez remplir le champ email");
      return;
    }

    const code = generateCode();
    const expirationTime = Date.now() + 5 * 60 * 1000; // Expiration dans 5 min

    const data = { email, code };

    try {
      console.log(data);
      const response = await storeVerificationCode(data);

      if (!response.success) {
        setInternalErrorMessage("Erreur lors de la génération du code, veuillez réessayer");
        return;
      }

      const templateParams = {
        email,
        from_name: "Forvis Mazars - Plateforme GRCenter",
        passcode: code,
      };

      await emailjs.send(
        "service_5gbh03k", // Service ID
        "template_vlo3sm2", // Template ID
        templateParams,
        "BTjaihQ7JDUofn8e2"
      );

      onSetExpirationTime(expirationTime);
      onNext(code, email);

    } catch (error) {
      console.error("Erreur :", error);
      setInternalErrorMessage("Une erreur est survenue, veuillez réessayer");
    }
  };

  return (
    <div className="flex justify-center mt-24  ">
      <div className="bg-white rounded-lg shadow-lg px-6 sm:px-10 py-12 flex flex-col items-center w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md gap-6">
        <h1 className="text-xl md:text-2xl font-semibold text-[var(--blue-menu)] text-center">
          Mot de passe oublié ?
        </h1>

        <p className="text-gray-600 text-center text-sm md:text-base">
          Entrez votre adresse email pour recevoir un code de vérification.
        </p>

        <div className="w-full">
          <InputForm
            type="email"
            label="Email"
            placeholder="Votre adresse email"
            flexDirection="flex-col"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        {internalErrorMessage && <p className="text-red-500 text-sm">{internalErrorMessage}</p>}

        <button
          className="w-full sm:w-2/3 md:w-1/2 border-none bg-[var(--blue-menu)] hover:bg-[var(--blue-conf)] text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out text-sm md:text-base"
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
