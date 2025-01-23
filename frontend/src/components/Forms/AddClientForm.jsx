import React from 'react'
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function AddClientForm({title}) {
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
      label="Nom du client "
      placeholder="Entrez le nom du client"
      width="420px"
      flexDirection={"column"}
    />
    <div className="form-row">
    <InputForm
        type="text" 
        label="Raison Social"
        placeholder="raison social"
        width="200px"
        flexDirection={"column"}
      />
      <InputForm
        type="text" 
        label="Secteur"
        placeholder="secteur"
        width="200px"
        flexDirection={"column"}
      />
      </div>
    <InputForm
        type="email" 
        label="E-mail"
        placeholder="Entrez l'e-mail du client"
        width="420px"
        flexDirection={"column"}
      />
      <div className="form-row">
      <InputForm
        type="text" 
        label="Contact 1"
        placeholder="numéro du téléphone"
        width="200px"
        flexDirection={"column"}
      />
      <InputForm
        type="text" 
        label="Contact 2"
        placeholder="numéro du téléphone"
        width="200px"
        flexDirection={"column"}
      />
      </div>
    

    {/* Bouton Créer */}
    <Button btnName="Créer" />
  </div>
  )
}

export default AddClientForm