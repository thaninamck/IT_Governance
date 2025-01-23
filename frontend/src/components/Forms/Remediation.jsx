import React from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function Remediation({ title }) {
  return (
    <div className="appForm_container">
      {/* Icône Close */}
      <button className="close-button" onClick={() => alert('Fermeture')}>
        &times;
      </button>
      
      {/* Titre dynamique */}
      <p>{title}</p>

      {/* Formulaire */}
      <InputForm
        type="text"
        label="Description de la remédiation"
        placeholder="Entrez la description de la remédiation..."
        width="600px"
        flexDirection={"column"}
      />
      <InputForm
        type="email" 
        label="E-mail"
        placeholder="Entrez l'e-mail de la personne concernée..."
        width="600px"
        flexDirection={"column"}
      />

      {/* Bouton Créer */}
      <Button btnName="Envoyer" />
    </div>
  );
}

export default Remediation;
