import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import StepNewPassword from "./subPages/StepNewPassword";

function ChangePasswordAfterFirstLogin() {
  const navigate = useNavigate();
  const infos={
    firstconnection:true,
    email:''
  }
  // Fonction pour gérer le retour (si nécessaire)
  const handleBack = () => {
    navigate("/login"); // Rediriger vers la page de connexion
  };

  // Fonction pour simuler l'e-mail de l'utilisateur (à adapter selon votre logique)
  const userEmail = "manel.mohandouali@mazars.dz"; // Remplacez par l'e-mail de l'utilisateur connecté

  return (
    <div className="bg-gray-50 px-4 h-screen">
    <div onClick={() => navigate("/")}>
      <img src="./mazars_logo.png" alt="Mazars Logo" className="w-28 md:w-36 lg:w-44" />
    </div>
    <div
        className="absolute top-36 left-14 cursor-pointer flex items-center"
        onClick={() =>  navigate("/login")}
      ><KeyboardBackspaceIcon className="text-gray-600" />
      <span className="text-gray-600 text-sm hover:underline ml-1">Retour</span>
    </div>
        <StepNewPassword
        infos={infos}
          email={userEmail} // Passez l'e-mail de l'utilisateur
        />
      </div>
 
  );
}

export default ChangePasswordAfterFirstLogin;