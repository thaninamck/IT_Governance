import React from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function AppForm({ title }) {
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
        label="Nom de l'application"
        placeholder="Entrez le nom de l'application/système..."
        width="600px"
        flexDirection={"column"}
      />
      <InputForm
      type="text"
        label="Description"
        placeholder="Entrez la description de l'application/système..."
        width="600px"
        flexDirection={"column"}
      />
      <InputForm
      type="text"
        label="Couche"
        placeholder="couche"
        width="200px"
        flexDirection={"column"}
      />

      {/* Bouton Save */}
      <Button btnName={"Créer"}/>
    </div>
  );
}

export default AppForm;
