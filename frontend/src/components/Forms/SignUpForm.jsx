import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import InputForm from './InputForm';
import './FormStyle.css';
import ReCAPTCHA from "react-google-recaptcha";
import SpinButton from '../SpinButton';
function SignUpForm({ title, username, password, onUsernameChange, onPasswordChange, onCaptchaChange, onSubmit, errorMessage,loading }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("submitting form");

    onSubmit(e);
    
  };

  return (
    <form className="appForm_container_login flex flex-col items-center space-y-4" onSubmit={handleSubmit}>
      {/* Titre dynamique */}
      <img src="/grcenterlogo1.png" alt="logo" className="h-44" />

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

      {/* <div className="flex justify-center">
      <ReCAPTCHA size="normal" sitekey="6LfzaOwqAAAAAGyx4zcdwN8kT5AH6Ov891S4nS0P" onChange={onCaptchaChange} />
      </div> */}

      {/* Message d'erreur global */}
      {typeof errorMessage === "string" && errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      {/* Lien "Mot de passe oublié ?" */}
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={() => {navigate('/pw')}}
      >
        <span className="text-subfont-gray text-sm mt-2 hover:underline">
          Mot de passe oublié ?
        </span>
      </div>

      {/* Bouton Connexion */}
     <SpinButton isLoading={loading}>Connexion</SpinButton>
    </form>
  );
}

export default SignUpForm;