import React from 'react'
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function AddUserForm({title}) {
  return (
    <div className="appForm_container">
    {/* Icône Close */}
    <button className="close-button" onClick={() => alert('Fermeture')}>
      &times;
    </button>
    
    {/* Titre dynamique */}
    <p>{title}</p>

    {/* Formulaire */}
    
    
    <div className="form-row">
    <InputForm
        type="text" 
        label="Nom"
        placeholder="nom"
        width="200px"
        flexDirection={"column"}
      />
      <InputForm
        type="text" 
        label="Prénom"
        placeholder="prenom"
        width="200px"
        flexDirection={"column"}
      />
      <InputForm
        type="text" 
        label="Nom d'utilisateur"
        placeholder="nom d'utilisateur"
        width="200px"
        flexDirection={"column"}
      />
    
      </div>
      <div className="form-row">
      
      <InputForm
        type="email" 
        label="Email"
        placeholder="e-mail"
        width="200px"
        flexDirection={"column"}
      />
      <InputForm
        type="text" 
        label="Contact"
        placeholder="contact"
        width="200px"
        flexDirection={"column"}
      />
      <InputForm
        type="Text" 
        label="Grade"
        placeholder="grade"
        width="200px"
        flexDirection={"column"}
      />
      </div>
      <div className="form-row">
      <InputForm
        type="password" 
        label="Mot de passe"
        placeholder="****"
        width="300px"
        flexDirection={"column"}
      />
      <InputForm
        type="password" 
        label="Confirmer mot de passe"
        placeholder="****"
        width="300px"
        flexDirection={"column"}
      />
      </div>
    
    
    

    {/* Bouton Créer */}
    <Button btnName="Créer" />
  </div>
  )
}

export default AddUserForm