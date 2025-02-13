import React, { useEffect, useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';
import Button from '../Button';
import emailjs from 'emailjs-com';

function AddUserForm({ title, isOpen, onClose, initialValues, onUserCreated }) {
  if (!isOpen) return null;

  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  const [userData, setUserData] = useState({
    username: '',
    nom: '',
    prenom: '',
    grade: '',
    email: '',
    contact: '',
    dateField: '',
    dateField1: getCurrentDate(),
    status: 'Bloqué',
    password: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Générer un mot de passe aléatoire
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!';
    return Array.from({ length: 10 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  };

  // Préremplir les champs si on est en mode update
  useEffect(() => {
    if (initialValues) {
      setUserData(initialValues);
      setIsUpdating(true);
    } else {
      setIsUpdating(false);
    }
  }, [initialValues]);

  // Générer automatiquement le username
  useEffect(() => {
    if (userData.nom && userData.prenom) {
      const generatedUsername = `${userData.prenom.trim().replace(/\s+/g, '').toLowerCase()}.${userData.nom.trim().replace(/\s+/g, '').toLowerCase()}`;
      setUserData(prev => ({ ...prev, username: generatedUsername }));
    }
  }, [userData.nom, userData.prenom]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedUser = { ...userData };

    if (!isUpdating) {
      const generatedPassword = generatePassword();
      updatedUser.password = generatedPassword;

      // Envoyer l'e-mail uniquement lors de la création
      const templateParams = {
        user_name: `${updatedUser.prenom} ${updatedUser.nom}`,
        user_email: updatedUser.email,
        user_password: generatedPassword,
      };

      try {
        const response = await emailjs.send('service_mcpkn9g', 'template_ln3j8zy', templateParams, 'oAXuwpg74dQwm0C_s');
        if (response.status !== 200) {
          alert('Échec de l\'envoi de l\'e-mail.');
          return;
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        alert('Une erreur est survenue lors de l\'envoi de l\'e-mail.');
        return;
      }
    }

    // Appeler la fonction de création ou de mise à jour
    onUserCreated(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <form className="appForm_container" onSubmit={handleSubmit}>
        <button className="close-button" type="button" onClick={onClose}>&times;</button>

        <p>{title}</p>

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
            readOnly // Correction ici
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

        <Button btnName="Créer" type="submit" />
      </form>
    </div>
  );
}

export default AddUserForm;
