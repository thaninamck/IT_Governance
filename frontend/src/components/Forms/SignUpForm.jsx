import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';
import ReCAPTCHA from "react-google-recaptcha";

function SignUpForm({ title, username, password, onUsernameChange, onPasswordChange, onSubmit }) {
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaError, setCaptchaError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCaptchaError(!captchaValue);
    if (!captchaValue) return;

    console.log("Form Data:", { userName, password, captchaValue });
  };

  return (
    <form className="appForm_container_login flex flex-col items-center space-y-4" onSubmit={onSubmit}>
      {/* Titre dynamique */}
       <img src="/logo.png" alt="logo" className="h-44" />

      {/* Formulaire */}
      <InputForm
        type="text"
        label=""
        placeholder="Nom d'utilisateur"
        width="400px"
        flexDirection="flex-col"
        value={username}
        onChange={onUsernameChange}
      />
      <InputForm
        type="password"
        label=""
        placeholder="*********"
        width="400px"
        flexDirection="flex-col"
        value={password}
        onChange={onPasswordChange}
      />

<div className="flex justify-center">
        <ReCAPTCHA size="normal" sitekey="6Lf1RdgqAAAAAO3IEJRIRtcR8bdaOxXwmm7_ChYY" onChange={setCaptchaValue} />
      </div>
      
      {captchaError && <h5 className="mt-2 text-xs text-red-600">Veuillez compléter le reCAPTCHA !</h5>}
      
     
      {/* Lien "Mot de passe oublié ?" */}
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={() => navigate('/pw')}
      >
        <span className="text-subfont-gray mt-4 hover:underline">
          Mot de passe oublié ?
        </span>
      </div>

      {/* Bouton Connexion */}
      <Button btnName="Connexion" type="submit" />
    </form>
  );
}

export default SignUpForm;
