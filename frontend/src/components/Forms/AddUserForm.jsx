import React, { useEffect, useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';

function AddUserForm({ title, isOpen, onClose, initialValues, onUserCreated }) {
  if (!isOpen) return null; // Ne pas afficher le modal si isOpen est false

  // Fonction pour obtenir la date actuelle au format YYYY-MM-DD
  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  // États pour chaque champ
  const [userData, setUserData] = useState({
    username: '',
    nom: '',
    prenom: '',
    grade: '',
    email: '',
    contact: '',
    dateField: '',
    dateField1: getCurrentDate(), // Date de création automatique
    status: 'Bloqué',
    password: '',
    confirmPassword: '',
  });

  // Fonction pour générer le username sans espace
  const generateUsername = (prenom, nom) => {
    if (prenom && nom) {
      return `${prenom.trim().replace(/\s+/g, '').toLowerCase()}.${nom.trim().replace(/\s+/g, '').toLowerCase()}`;
    }
    return '';
  };

  

  // Mettre à jour username dès que prenom ou nom change
  useEffect(() => {
    if (initialValues) {
      setUserData(initialValues);
    }
  }, [initialValues]);
  
// Mettre à jour le username automatiquement
useEffect(() => {
  if (userData.nom && userData.prenom) {
    const generatedUsername = `${userData.prenom.trim().replace(/\s+/g, '').toLowerCase()}.${userData.nom.trim().replace(/\s+/g, '').toLowerCase()}`;
    setUserData(prevData => ({
      ...prevData,
      username: generatedUsername,
    }));
  }
}, [userData.nom, userData.prenom]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêcher le rechargement
    onUserCreated({ ...userData, dateField1: getCurrentDate() }); // Met à jour avant d'envoyer
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <form className="appForm_container" onSubmit={handleSubmit}>
        {/* Icône Close */}
        <button className="close-button" type="button" onClick={onClose}>
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
            flexDirection="flex-col"
            value={userData.nom}
            onChange={e => setUserData({ ...userData, nom: e.target.value })}
          />
          <InputForm
            type="text"
            label="Prénom"
            placeholder="Prénom"
            width="200px"
            flexDirection="flex-col"
            value={userData.prenom}
            onChange={e => setUserData({ ...userData, prenom: e.target.value })}
          />
          <InputForm
            type="text"
            label="Nom d'utilisateur"
            placeholder="Nom d'utilisateur"
            width="200px"
            flexDirection="flex-col"
            value={userData.username}
            disabled // Désactivé car généré automatiquement
          />
        </div>
        <div className="form-row">
          <InputForm
            type="email"
            label="Email"
            placeholder="Email"
            width="200px"
            flexDirection="flex-col"
            value={userData.email}
            onChange={e => setUserData({ ...userData, email: e.target.value })}
          />
          <InputForm
            type="text"
            label="Contact"
            placeholder="Contact"
            width="200px"
            flexDirection="flex-col"
            value={userData.contact}
            onChange={e => setUserData({ ...userData, contact: e.target.value })}
          />
          <InputForm
            type="text"
            label="Grade"
            placeholder="Grade"
            width="200px"
           flexDirection="flex-col"
            value={userData.grade}
            onChange={e => setUserData({ ...userData, grade: e.target.value })}
          />
        </div>
        <div className="form-row">
          <InputForm
            type="password"
            label="Mot de passe"
            placeholder="****"
            width="300px"
            flexDirection="flex-col"
            value={userData.password || ""}
            onChange={e => setUserData({ ...userData, password: e.target.value })}
          />
          <InputForm
            type="password"
            label="Confirmer mot de passe"
            placeholder="****"
            width="300px"
            flexDirection="flex-col"
            value={userData.confirmPassword || ""}
            onChange={e => setUserData({ ...userData, confirmPassword: e.target.value })}
          />
        </div>

        {/* Bouton Créer */}
        <Button btnName="Créer" type="submit" />
      </form>
    </div>
  );
}

export default AddUserForm;
