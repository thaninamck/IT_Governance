import React, { useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';
import AddButton from '../AddButton';


function AddCoucheForm({title}) {

    // États pour chaque champ
  const [coucheName, setCoucheName] = useState('');
  const [showForm, setShowForm] = useState(false); // État pour afficher le formulaire

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { coucheName };
    console.log('Form Data:', formData);
    alert('Couche ajoutée avec succès !');
   // setShowForm(false); // Masquer le formulaire après soumission
  };
      
      
  const handleClose = () => {
    setShowForm(!showForm);
  };
      
  return (

    <div className="appForm_container coucheForm_container" >
    

    {/* Titre dynamique */}
    <p>{title}</p>

    {/* Formulaire */}
    <div className="form-row">

    <div className="form-row align_end">
      
    <InputForm
        type="text"
        label="Couches"
        placeholder="Nom"
        width="200px"
        flexDirection="column"
        value={coucheName}
        onChange={(e) => setCoucheName(e.target.value)}
      />

      <AddButton title={'Ajouter une couche'} onClick={() => setShowForm(true)} />
      </div>
      
      {showForm && (
      <form className="form-row" onSubmit={handleSubmit}>
      <InputForm
        type="text"
        label="Nom de la couche"
        placeholder="Nom de la couche"
        width="200px"
        flexDirection="column"
        value={coucheName}
        onChange={(e) => setCoucheName(e.target.value)}
      />
      <button className="close-button" type="button" onClick={handleClose}>
          &times;
        </button>
      <Button btnName="Enregistrer" type="submit" />
      </form>
       )}

    </div>
    
    
  </div>
  )
}

export default AddCoucheForm