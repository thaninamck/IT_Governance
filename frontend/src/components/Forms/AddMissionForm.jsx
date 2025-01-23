import React from 'react'
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';
import icons from '../../assets/Icons';

function AddMissionForm({title}) {
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
      label="Nom de la mission "
      placeholder="Entrez le nom du client"
      width="420px"
      flexDirection={"column"}
    />
    <div className="form-row">
    <InputForm
        type="text" 
        label="Client"
        placeholder="raison social"
        width="200px"
        flexDirection={"column"}
      />
      <button className='btn_addclient'> <icons.addCircle sx={{width:"18px"}}/> Ajouter client</button>
      </div>
      <div className="form-row">
      <InputForm
        type="date" 
        label="Date début"
        placeholder=""
        width="200px"
        flexDirection={"column"}
      />
      <InputForm
        type="text" 
        label="Durée"
        placeholder="20 jours"
        width="200px"
        flexDirection={"column"}
      />
      </div>
    <InputForm
        type="text" 
        label="Période audité"
        placeholder="6mois"
        width="420px"
        flexDirection={"column"}
      />
      
      <InputForm
        type="text" 
        label="Manager"
        placeholder="manager"
        width="420px"
        flexDirection={"column"}
      />
    

    {/* Bouton Créer */}
    <Button btnName="Créer" />
  </div>
  )
}

export default AddMissionForm