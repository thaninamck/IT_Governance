import React, { useState } from "react";
import InputForm from "../../components/Forms/InputForm";
import PasswordIcon from '@mui/icons-material/Password';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext"; // Importer le contexte
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function StepNewPassword({infos}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Gérer l'affichage des erreurs
  
  const navigate = useNavigate();
const firstconnection=infos.firstconnection;

  // Utiliser le contexte d'authentification
  const { changePassword, loading, error,forgotPasswordChange } = useAuth();

  const checkPasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%_*?&]/.test(password);
    const isLongEnough = password.length >= 12;

    if (isLongEnough && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
      return "excellent";
    } else if (isLongEnough && (hasUpperCase || hasLowerCase || hasNumber || hasSpecialChar)) {
      return "moyen";
    } else {
      return "faible";
    }
  };

  const firstLoginChangePassword = async () => {
    if (!password || !confirmPassword) {
      setErrorMessage("Veuillez remplir tous les champs.")
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.")
      //setErrorMessage("Les mots de passe ne correspondent pas.")
      
      return;
    }

    const strength = checkPasswordStrength(password);
    if (strength === "faible") {
      toast.warn("Le mot de passe est trop faible. Il doit contenir au moins 12 caractères, une majuscule, une minuscule et un chiffre.");
      setErrorMessage(msg);
      return;
    }

    try {
      const data = {
        new_password: password,
        new_password_confirmation: confirmPassword
      };
      await changePassword(data); 
      toast.success("Mot de passe changé avec succès !");
      navigate("/login"); 
    } catch (err) {
      alert(err); // Affiche l’erreur retournée
    }
  };


  const ForgotPasswordChange= async () => {
    if (!password || !confirmPassword) {
      setErrorMessage("veuillez remplir tous les champs")
      return;
    }

    if (password !== confirmPassword) {
      //toast.error("Les mots de passe ne correspondent pas.")

      setErrorMessage("Les mots de passe ne correspondent pas !")
      return;
    }

    const strength = checkPasswordStrength(password);
    if (strength === "faible") {
      toast.error("Le mot de passe est trop faible. Il doit contenir au moins 12 caractères, une majuscule, une minuscule et un chiffre.")

     
      return;
    }

    try {
      const data = {
        email:infos.email,
        new_password: password,
        new_password_confirmation:password
        
      };
      console.log(data)
      await forgotPasswordChange(data); // Appeler la fonction de changement de mot de passe du contexte
      toast.success("Mot de passe changé avec succès veuillez vous reconnecter avec le nouveau mot de passe!");
      navigate("/login"); // Rediriger vers la connexion après succès
    } catch (err) {
      toast.error(err);
    }
  };

 
  return (
    <div className="flex justify-center items-center px-4 py-8 ">
      <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center w-full max-w-xl gap-4">
        <PasswordIcon sx={{ color: 'var(--blue-menu)', fontSize: '4rem' }} />
        <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-[var(--blue-menu)] text-center">
          Nouveau mot de passe
        </h1>
        <p className="text-gray-600 text-center text-sm">Définissez votre nouveau mot de passe.</p>
<div className="w-full flex flex-col gap-4">
        <InputForm
          type="password"
          label="Nouveau mot de passe"
          placeholder="Mot de passe"
          width="100%"
          flexDirection="flex-col"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordStrength(checkPasswordStrength(e.target.value));
          }}
        />
        <InputForm
          type="password"
          label="Confirmer"
          placeholder="Confirmez le mot de passe"
          width="100%"
          flexDirection="flex-col"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
</div>
        {/* Message avec les règles */}
        <p className="text-xs text-gray-500 text-center max-w-sm">
          Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%_*?&).
        </p>

        {errorMessage && <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>}

        <button
          className="w-full mt-4 border-none bg-[var(--blue-menu)] hover:bg-[var(--blue-conf)] text-white font-medium py-2 px-6 rounded-lg transition duration-300 ease-in-out text-sm md:text-base"
          onClick={firstconnection ? firstLoginChangePassword : ForgotPasswordChange}
          disabled={loading}
        >
          {loading ? "Changement en cours..." : "Valider"}
        </button>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default StepNewPassword;