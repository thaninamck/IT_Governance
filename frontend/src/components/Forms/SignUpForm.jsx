import React from 'react';
import { useNavigate } from 'react-router-dom';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function SignUpForm({ title, username, password, onUsernameChange, onPasswordChange, onSubmit }) {
  const navigate = useNavigate();

  return (
    <form className="appForm_container_login signup_container" onSubmit={onSubmit}>
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
        flexDirection="flex-col"
        value={username}
        onChange={onUsernameChange}
      />
      <InputForm
        type="password"
        label=""
        placeholder="*********"
        width="400px"
        flexDirection="flex-col"
        value={password}
        onChange={onPasswordChange}
      />

      {/* Lien "Mot de passe oublié ?" */}
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={() => navigate('/pw')}
      >
        <span className="text-subfont-gray mt-4 hover:underline">
          Mot de passe oublié ?
        </span>
      </div>

      {/* Bouton Connexion */}
      <Button btnName="Connexion" type="submit" />
    </form>
  );
}

export default SignUpForm;