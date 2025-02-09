import React, { useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function PasswordChange({title}) {

     // États pour chaque champ
      const [oldpassword, setOldpassword] = useState('');
      const [newpassword, setNewpassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
    

      const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
          oldpassword,
          newpassword,
          confirmPassword,
        };
        console.log('Form Data:', formData);
        alert('mot de passe changé  avec succès !');
        // Vous pouvez envoyer les données via une API ici
      };
    
  return (
    <form className="appForm_container password_container" onSubmit={handleSubmit}>

        {/* Titre dynamique */}
        <p>{title}</p>

        {/* Formulaire */}
        
        <InputForm
            type="password"
            label="Mot de passe actuel"
            placeholder="******"
            width="300px"
           flexDirection="flex-col"
            value={oldpassword}
            onChange={(e) => setOldpassword(e.target.value)}
          />
          <InputForm
            type="password"
            label="Nouveau  mot de passe"
            placeholder="******"
            width="300px"
            flexDirection="flex-col"
            value={newpassword}
            onChange={(e) => setNewpassword(e.target.value)}
          />
          <InputForm
            type="password"
            label="Confirmation"
            placeholder="******"
            width="300px"
           flexDirection="flex-col"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        {/* Bouton Envoyer */}
        <Button btnName="Changer" type="submit" />
      </form>
  )
}

export default PasswordChange