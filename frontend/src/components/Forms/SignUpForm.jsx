import React, { useState } from "react";
import InputForm from "./InputForm";
import "./FormStyle.css";
import Button from "../Button";
import ReCAPTCHA from "react-google-recaptcha";

function SignUpForm({ title }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaError, setCaptchaError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCaptchaError(!captchaValue);
    if (!captchaValue) return;

    console.log("Form Data:", { userName, password, captchaValue });
  };

  return (
    <form className="appForm_container_login flex flex-col items-center space-y-4" onSubmit={handleSubmit}>
      <img src="/logo.png" alt="logo" className="h-44" />
      <InputForm type="text" placeholder="Nom d'utilisateur" width="400px" value={userName} onChange={(e) => setUserName(e.target.value)} />
      <InputForm type="password" placeholder="*********" width="400px" value={password} onChange={(e) => setPassword(e.target.value)} />

      <div className="flex justify-center">
        <ReCAPTCHA size="normal" sitekey="6Lf1RdgqAAAAAO3IEJRIRtcR8bdaOxXwmm7_ChYY" onChange={setCaptchaValue} />
      </div>
      
      {captchaError && <h5 className="mt-2 text-xs text-red-600">Veuillez compléter le reCAPTCHA !</h5>}
      
      <a href="/reset-password" className="mt-2 text-sm text-blue-500 hover:underline">
        Mot de passe oublié ?
      </a>
      
      <Button btnName="Connexion" type="submit" />
    </form>
  );
    

    
  
}

export default SignUpForm;
