// import React, { useState,useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import SignUpForm from "../components/Forms/SignUpForm";
// import whiteLogo from "../../public/whiteLogo.png";
// import { useAuth } from "../Context/AuthContext"; // Importer le contexte
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [captchaValue, setCaptchaValue] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   // Utiliser le contexte d'authentification
//   const { loginUser, loading, error } = useAuth();
//   useEffect(() => {
//     if (error) {
//       console.log(error);
//       setErrorMessage(error);
//     }
//   }, [error]);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     // Valider les champs
//     if (!username || !password 
//       // || !captchaValue
//     ) {
//       setErrorMessage("Veuillez remplir tous les champs.");
//       return;
//     }

//     try {
//       // Appeler la fonction de connexion du contexte
//       const response = await loginUser({
//         email: username, 
//         password,
//         captcha: captchaValue,
//       });

//       // Stockez les infos utilisateur dans le localStorage
//     localStorage.setItem('user', JSON.stringify({
//       role: response.user.role,
//       fullName: response.user.firstName,
//       position: response.user.grade
//     }));

//       // Rediriger l'utilisateur en fonction de la réponse
//       if (response?.must_change_password) {
//         navigate("/firstconnection");
//       // } else if (response?.user.role === "admin")  {
//       //   console.log("response",response);
//       //   navigate( "/adminHomePage");
//       }else{
//         navigate( "/missions");
//       }
      
    
//     } catch (error) {
//       // Gérer les erreurs de connexion
//       setErrorMessage(error);
//     }
//   };

//   return (
//     <main className="flex min-h-screen">
//       <div className="sm:w-[20%] md:w-[35%] sm:flex sm:flex-col py-5 w-0 bg-blue-menu relative -z-10">
//         <p className="font-semibold mt-4 text-white text-3xl text-center">
//           Bienvenue dans <br /> la plateforme <br /> d’audit IT
//         </p>
//         <div className="absolute bottom-5 ml-4">
//           <img src={whiteLogo} alt="logo" className="w-60" />
//         </div>
//       </div>

//       <div className="bg-white relative flex-1 flex justify-center items-center rounded-l-xl -ml-4 text-black shadow-lg">
//         <SignUpForm
//           title="Forvis Mazars"
//           username={username}
//           password={password}
//           captchaValue={captchaValue}
//           onUsernameChange={(e) => setUsername(e.target.value)}
//           onPasswordChange={(e) => setPassword(e.target.value)}
//           onCaptchaChange={setCaptchaValue}
//           onSubmit={handleSubmit}
//           errorMessage={errorMessage}
//           loading={loading} // Passer l'état de chargement au formulaire
//         />
//       </div>
//     </main>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignUpForm from "../components/Forms/SignUpForm";
import whiteLogo from "../../public/whiteLogo.png";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { loginUser, loading, error } = useAuth();

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username || !password) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await loginUser({
        email: username,
        password,
        captcha: captchaValue,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          role: response.user.role,
          fullName: response.user.firstName,
          position: response.user.grade,
        })
      );

      if (response?.must_change_password) {
        navigate("/firstconnection");
      } else {
        navigate("/missions");
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      {/* Left Side */}
      <div className="w-full md:w-[35%] bg-blue-menu flex flex-col justify-between py-8 px-6 text-white">
        <div className="mt-14">
          <h1 className="text-3xl font-bold mb-6 text-center animate-fade-in">
            Bienvenue sur la plateforme d’audit IT
          </h1>
        </div>
        <div className="flex justify-center">
          <img
            src={whiteLogo}
            alt="Logo"
            className="w-52 animate-float transition-all duration-700"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white rounded-l-xl shadow-lg">
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
          loading={loading}
        />
      </div>
    </main>
  );
};

export default Login;
