import React, { useState } from "react";
import InputForm from "../../components/Forms/InputForm";
import PasswordIcon from '@mui/icons-material/Password';
import { useNavigate } from "react-router-dom";

function StepNewPassword({ onBack, email }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

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

    setLoading(true);

    // try {
    //   const response = await fetch("http://localhost:8000/api/reset-password", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email,
    //       newPassword: password,
    //     }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     alert("Mot de passe changé avec succès !");
    //     navigate("/login"); // Rediriger vers la page de connexion
    //   } else {
    //     alert(data.message || "Erreur lors du changement de mot de passe.");
    //   }
    // } catch (error) {
    //   console.error("Erreur:", error);
    //   alert("Une erreur est survenue. Veuillez réessayer.");
    // } finally {
    //   setLoading(false);
    // }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "faible":
        return "red";
      case "moyen":
        return "orange";
      case "excellent":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <>
      <div className='mx-6'>
        <div className="bg-white rounded-lg shadow-lg px-12 flex flex-col items-center gap-4 py-6">
          <PasswordIcon 
            sx={{ color: 'var(--blue-conf)', fontSize: '4rem' }}
            aria-label="Icône de réinitialisation de mot de passe"
          />
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
          <div className="w-full max-w-[450px]">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full`}
                style={{
                  width: passwordStrength === "faible" ? "33%" : passwordStrength === "moyen" ? "66%" : "100%",
                  backgroundColor: getPasswordStrengthColor(),
                }}
              ></div>
            </div>
            <p className="text-sm mt-1">
              <span style={{ color: getPasswordStrengthColor() }}>{passwordStrength}</span>
            </p>
          </div>
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
        </div>
      </div>
    </>
  );
}

export default StepNewPassword;