import React, { useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function AddUserForm({ title }) {
  const [open, setOpen] = useState(true);

  // États pour chaque champ
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [grade, setGrade] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      lastName,
      firstName,
      username,
      email,
      contact,
      grade,
      password,
      confirmPassword,
    };
    console.log('Form Data:', formData);
    alert('Utilisateur ajouté avec succès !');
    // Vous pouvez envoyer les données via une API ici
  };

  return (
    open && (
      <form className="appForm_container" onSubmit={handleSubmit}>
        {/* Icône Close */}
        <button className="close-button" type="button" onClick={handleClose}>
          &times;
        </button>

        {/* Titre dynamique */}
        <p>{title}</p>

        {/* Formulaire */}
        <div className="form-row">
          <InputForm
            type="text"
            label="Nom"
            placeholder="Nom"
            width="200px"
            flexDirection="column"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <InputForm
            type="text"
            label="Prénom"
            placeholder="Prénom"
            width="200px"
            flexDirection="column"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputForm
            type="text"
            label="Nom d'utilisateur"
            placeholder="Nom d'utilisateur"
            width="200px"
            flexDirection="column"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-row">
          <InputForm
            type="email"
            label="Email"
            placeholder="Email"
            width="200px"
            flexDirection="column"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputForm
            type="text"
            label="Contact"
            placeholder="Contact"
            width="200px"
            flexDirection="column"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <InputForm
            type="text"
            label="Grade"
            placeholder="Grade"
            width="200px"
            flexDirection="column"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>
        <div className="form-row">
          <InputForm
            type="password"
            label="Mot de passe"
            placeholder="****"
            width="300px"
            flexDirection="column"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputForm
            type="password"
            label="Confirmer mot de passe"
            placeholder="****"
            width="300px"
            flexDirection="column"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Bouton Créer */}
        <Button btnName="Créer" type="submit" />
      </form>
    )
  );
}

export default AddUserForm;
