import React from 'react'
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function SuiviRemForm({title}) {
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
      type="Date" 
      label="Date création "
      placeholder=""
      width="200px"
      flexDirection="flex-col"
    />
    <InputForm
      type="text"
      label="Description de la remédiation"
      placeholder="Entrez la description de la remédiation..."
      width="600px"
      flexDirection="flex-col"
    />
    <InputForm
        type="email" 
        label="E-mail"
        placeholder="Entrez l'e-mail de la personne concernée..."
        width="600px"
       flexDirection="flex-col"
      />
      <InputForm
        type="text" 
        label="Suivi"
        placeholder="Text ..."
        width="600px"
        flexDirection="flex-col"
      />
    

    {/* Bouton Créer */}
    <Button btnName="Enregistrer" />
  </div>
  )
}

export default SuiviRemForm