import React, { useState } from "react";
import InputForm from "./InputForm";
import "./FormStyle.css";
import Button from "../Button";
import ReCAPTCHA from "react-google-recaptcha";
//secret key just in case 
//6Lf1RdgqAAAAAFjzO0aOBYV6NszBbCJ8psytfjnJ 



function SignUpForm({ title }) {
  // États pour chaque champ
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);

  const onChange = (value) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  if (!captchaValue) {
    alert("Veuillez compléter le reCAPTCHA !");
    return;
  }

  const formData = {
    userName,
    password,
    captchaValue
  };
  console.log("Form Data:", formData);
  };
  return (
    <form
      className="appForm_container_login signup_container   "
      onSubmit={handleSubmit}
    >
      {/* Titre dynamique */}
      <p>
        <span style={{ color: "#0172D3" }}>{title.split(" ")[0]}</span>{" "}
        <span style={{ color: "#181C8F" }}>{title.split(" ")[1]}</span>
      </p>

      {/* Formulaire */}
      <InputForm
        type="text"
        label=""
        placeholder="Nom d'utilisateur"
        width="400px"
        flexDirection="column"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <InputForm
        type="password"
        label=""
        placeholder="*********"
        width="400px"
        flexDirection="column"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex justify-center  my-2">
        <ReCAPTCHA size="normal" sitekey="6Lf1RdgqAAAAAO3IEJRIRtcR8bdaOxXwmm7_ChYY" onChange={onChange} />,
      </div>

      {/* Lien "Mot de passe oublié ?" positionné à droite */}
      <div className="flex justify-center items-center mt-4 text-subfont-gray">
        <a href="/reset-password">Mot de passe oublié ?</a>
      </div>

      {/* Bouton Créer */}

      <Button btnName="Connexion" type="submit" />
    </form>
  );
}

export default SignUpForm;
