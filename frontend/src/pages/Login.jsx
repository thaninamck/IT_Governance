import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignUpForm from "../components/Forms/SignUpForm";
import whiteLogo from "../../public/whiteLogo.png";
import { useAuth } from "../Context/AuthContext"; // Importer le contexte
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Utiliser le contexte d'authentification
  const { loginUser, loading, error } = useAuth();
  useEffect(() => {
    if (error) {
      console.log(error);
      setErrorMessage(error);
    }
  }, [error]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Valider les champs
    if (!username || !password || !captchaValue) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      // Appeler la fonction de connexion du contexte
      const response = await loginUser({
        email: username, 
        password,
        captcha: captchaValue,
      });

      // Rediriger l'utilisateur en fonction de la réponse
      if (response?.must_change_password) {
        navigate("/firstconnection");
      } else {
        if (response?.role==1){
          navigate("/adminHomePage");
        }
          else{
        navigate("/missions");}
      }
    
    } catch (error) {
      // Gérer les erreurs de connexion
      setErrorMessage(error);
    }
  };

  return (
    <main className="flex min-h-screen">
      <div className="sm:w-[20%] md:w-[30%] sm:flex sm:flex-col py-5 w-0 bg-blue-menu relative -z-10">
        <p className="font-semibold mt-4 text-white text-3xl text-center">
          Bienvenue dans <br /> la plateforme <br /> d’audit IT
        </p>
        <div className="absolute bottom-5 ml-4">
          <img src={whiteLogo} alt="logo" className="w-60" />
        </div>
      </div>

      <div className="bg-white relative flex-1 flex justify-center items-center rounded-l-xl -ml-4 text-black shadow-lg">
        <SignUpForm
          title="Forvis Mazars"
          username={username}
          password={password}
          captchaValue={captchaValue}
          onUsernameChange={(e) => setUsername(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onCaptchaChange={setCaptchaValue}
          onSubmit={handleSubmit}
          errorMessage={errorMessage}
          loading={loading} // Passer l'état de chargement au formulaire
        />
      </div>
    </main>
  );
};

export default Login;