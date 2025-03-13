import React, { useState } from "react";
import InputForm from "../../components/Forms/InputForm";
import PasswordIcon from '@mui/icons-material/Password';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext"; // Importer le contexte

function StepNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  // Utiliser le contexte d'authentification
  const { changePassword, loading, error } = useAuth();

  const checkPasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 12;

    if (isLongEnough && hasUpperCase && hasLowerCase && hasNumber) {
      return "excellent";
    } else if (isLongEnough && (hasUpperCase || hasLowerCase || hasNumber)) {
      return "moyen";
    } else {
      return "faible";
    }
  };

  const handleChangePassword = async () => {
    if (!password || !confirmPassword) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    const strength = checkPasswordStrength(password);
    if (strength === "faible") {
      alert("Le mot de passe est trop faible. Il doit contenir au moins 12 caractères, une majuscule, une minuscule et un chiffre.");
      return;
    }

    try {
      const data = {
        new_password: password,
        new_password_confirmation: confirmPassword
      };
      await changePassword(data); // Appeler la fonction de changement de mot de passe du contexte
      navigate("/login"); // Rediriger vers la connexion après succès
    } catch (err) {
      alert(err); // Affiche l’erreur retournée
    }
  };

  return (
    <div className='mx-6'>
      <div className="bg-white rounded-lg shadow-lg px-12 flex flex-col items-center gap-4 py-6">
        <PasswordIcon sx={{ color: 'var(--blue-conf)', fontSize: '4rem' }} />
        <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-[var(--blue-menu)] text-center">
          Nouveau mot de passe
        </h1>
        <p className="text-gray-600 text-center">Définissez votre nouveau mot de passe.</p>

        <InputForm 
          type="password" 
          label="Nouveau mot de passe" 
          placeholder="Mot de passe" 
          width="450px"
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
          width="450px"
          flexDirection="flex-col"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />

        <button
          className="w-[41%] mt-4 border-none bg-[var(--blue-conf)] hover:bg-[var(--blue-menu)] text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out text-sm md:text-base lg:text-lg"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? "Changement en cours..." : "Changer le mot de passe"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default StepNewPassword;