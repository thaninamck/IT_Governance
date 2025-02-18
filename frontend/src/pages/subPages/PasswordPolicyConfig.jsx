import React, { useState } from 'react';
import InputForm from '../../components/Forms/InputForm';

function PasswordPolicyConfig() {
  const [sessionDuration, setSessionDuration] = useState(60);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [minPasswordLength, setMinPasswordLength] = useState(12);
  const [maxPasswordLength, setMaxPasswordLength] = useState(20);
  const [passwordExpiration, setPasswordExpiration] = useState(60);
  const [notifyBeforeExpiration, setNotifyBeforeExpiration] = useState(7);
  const [policy, setPolicy] = useState({
    includeUpperLower: true,
    includeSpecialChars: true,
    includeNumbers: true,
  });

  const handleCheckboxChange = (field) => {
    setPolicy({ ...policy, [field]: !policy[field] });
  };

  const handleValidation = () => {
    // Logique pour valider et enregistrer la configuration
    console.log({
      sessionDuration,
      maxAttempts,
      minPasswordLength,
      maxPasswordLength,
      passwordExpiration,
      notifyBeforeExpiration,
      policy,
    });
    alert('Configuration sauvegardée avec succès !');
  };

  return (
    <div className="p-2 pl-6 relative">
      <h2 className="text-xl font-bold mb-4">Configuration de la politique de mot de passe</h2>

      {/* Durée de validité des sessions */}
      <div className="mb-4 flex flex-row items-center justify-between w-[320px]">
        <InputForm
          type="number"
          label="Durée de validité des sessions"
          placeholder="... "
          width="60px"
          flexDirection="flex-row items-center justify-center gap-3 text-sm font-medium text-gray-700 "
          value={sessionDuration}
          onChange={(e) => setSessionDuration(e.target.value)}
        />
        <span className="mt-2">Min</span>
      </div>

      {/* Nombre maximum de tentatives */}
      <div className="mb-4 flex flex-row items-center justify-between w-[360px]">
        <InputForm
          type="number"
          label="Nombre maximum de tentatives"
          placeholder="... "
          width="60px"
          flexDirection="flex-row items-center justify-center gap-3 text-sm font-medium text-gray-700 "
          value={maxAttempts}
          onChange={(e) => setMaxAttempts(e.target.value)}
        />
      </div>

      {/* Politique de mot de passe */}
      <label className="block ml-1 text-sm font-medium text-gray-700 mb-2">Politique de mot de passe</label>
      <div className="mb-6 pl-4 flex flex-row justify-between w-[700px]">
        <div>
          <InputForm
            type="number"
            label="Minimum caractères"
            placeholder="... "
            width="60px"
            flexDirection="flex-row items-center gap-3 font-medium placeholder:text-center"
            value={minPasswordLength}
            onChange={(e) => setMinPasswordLength(e.target.value)}
          />
          <InputForm
            type="number"
            label="Maximum caractères"
            placeholder="... "
            width="60px"
            flexDirection="flex-row items-center gap-3 font-medium"
            value={maxPasswordLength}
            onChange={(e) => setMaxPasswordLength(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={policy.includeUpperLower}
              onChange={() => handleCheckboxChange('includeUpperLower')}
            />
            Inclure des lettres majuscules/minuscules
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={policy.includeSpecialChars}
              onChange={() => handleCheckboxChange('includeSpecialChars')}
            />
            Inclure des caractères spéciaux
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={policy.includeNumbers}
              onChange={() => handleCheckboxChange('includeNumbers')}
            />
            Inclure des chiffres
          </label>
        </div>
      </div>

      {/* Expiration des mots de passe */}
      <div className="mb-4 flex flex-row items-center justify-between w-[330px]">
        <InputForm
          type="number"
          label="Expiration des mots de passe"
          placeholder="... "
          width="60px"
          flexDirection="flex-row items-center justify-center gap-3 text-sm font-medium text-gray-700 "
          value={passwordExpiration}
          onChange={(e) => setPasswordExpiration(e.target.value)}
        />
        <span className="mt-2">Jours</span>
      </div>

      {/* Notifier avant expiration */}
      <div className="mb-4 flex flex-row items-center justify-between w-[300px]">
        <InputForm
          type="number"
          label="Notifier avant l'expiration"
          placeholder="... "
          width="60px"
          flexDirection="flex-row items-center justify-center gap-3 text-sm font-medium text-gray-700 "
          value={notifyBeforeExpiration}
          onChange={(e) => setNotifyBeforeExpiration(e.target.value)}
        />
        <span className="mt-2">Jours</span>
      </div>

      {/* Bouton de validation */}
      <div className="absolute  right-4">
        <button
          className="px-6 py-2 mb-6  bg-[var(--blue-menu)] border-none text-white  rounded-lg hover:bg-blue-600"
          onClick={handleValidation}
        >
          Valider
        </button>
      </div>
    </div>
  );
}

export default PasswordPolicyConfig;
