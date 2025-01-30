import React, { useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function SignUpForm({ title }) {
    // États pour chaque champ
      const [userName, setUserName] = useState('');
      const [password, setPassword] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
          userName,
          password,
        };
        console.log('Form Data:', formData);
        alert('Sign up avec succès !');
        // Vous pouvez envoyer les données via une API ici
      };
  return (

    <form className="appForm_container signup_container" onSubmit={handleSubmit}>
    {/* Titre dynamique */}
    <p>
    <span style={{ color: '#0172D3' }}>{title.split(' ')[0]}</span>{' '}
  <span style={{ color: '#181C8F' }}>{title.split(' ')[1]}</span>
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
   {/* Lien "Mot de passe oublié ?" positionné à droite */}
   <div className="forgot-password">
                <a href="/reset-password">Mot de passe oublié ?</a>
            </div>

    {/* Bouton Créer */}
    <Button btnName="Connexion" type="submit" />
  </form>
  )
}

export default SignUpForm