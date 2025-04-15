import React, { useEffect, useRef, useState } from 'react';
import InputForm from './InputForm';
import './FormStyle.css';

function Remediation({ title, initialValues = {}, onAdd, idControle ,onClose}) {
  const [open, setOpen] = useState(true);
  const isFirstRender = useRef(true);

  
  
  // États pour chaque champ
  const [description, setDescription] = useState(initialValues?.description || '');
  const [owner_cntct, setContact] = useState(initialValues?.owner_cntct|| '');
  // const [status, setStatus] = useState(initialValues?.status || '');
  // const [dateField, setDateField] = useState(initialValues?.dateField || '');
  // const [dateField1, setDateField1] = useState(initialValues?.dateField1 || '');

  // État pour gérer les erreurs de validation
  const [error, setError] = useState('');

  const handleClose = () => {
    onAdd({});
    onClose();
    setOpen(false);
  };

  // Mettre à jour les états si initialValues change
  useEffect(() => {
    if (isFirstRender.current) {
      setDescription(initialValues.description || '');
      setContact(initialValues.owner_cntct || '');
      // setStatus(initialValues.status || 'Non_commencee');
      // setDateField(initialValues.dateField || '');
      // setDateField1(initialValues.dateField1 || '');
      isFirstRender.current = false;
    }
  }, [initialValues]);

  // Fonction pour valider les dates
  const validateDates = (startDate, endDate) => {
    if (new Date(startDate) > new Date(endDate)) {
      setError('La date de fin doit être postérieure à la date de début.');
      return false;
    }
    setError(''); // Réinitialiser l'erreur si les dates sont valides
    return true;
  };

  // Fonction pour gérer le changement de la date de fin
  const handleDateField1Change = (e) => {
    const selectedDate = e.target.value;

    // Vérifier si la date sélectionnée est antérieure à la date de début
    if (new Date(selectedDate) < new Date(dateField)) {
      setError('La date de fin doit être postérieure à la date de début.');
      setDateField1(''); // Réinitialiser la date de fin si elle est invalide
    } else {
      setError('');
      setDateField1(selectedDate);
    }
  };

  // Fonction pour générer un identifiant d'action unique
  const generateActionId = (idControle) => {
    if (initialValues.id) {
      return initialValues.id; // Conserver l'ID existant lors de la mise à jour
    }
    const now = new Date();
    const mois = now.toLocaleString('fr-FR', { month: 'short' }); // Ex: "Sep"
    const annee = now.getFullYear().toString().slice(-2); // Ex: "24"
    const numeroSequentiel = String(Math.floor(Math.random() * 999)).padStart(3, '0'); // Ex: "001"
  
    return `ACT_${mois}${annee}_${idControle}_${numeroSequentiel}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

     // Vérifier que tous les champs requis sont remplis
  if (!description || !owner_cntct /*|| !dateField ||!dateField1*/ ) {
    setError('Veuillez remplir tous les champs obligatoires.');
    return; // Empêcher la soumission
  }

    // Valider les dates avant de soumettre le formulaire
    // if (!validateDates(dateField, dateField1)) {
    //   return; // Empêcher la soumission si les dates ne sont pas valides
    // }
    
    setError(''); // Réinitialiser les erreurs si tout est bon


    const formData = {
      id: initialValues?.id, //generateActionId(idControle),
      description,
      owner_cntct,
      // status: status || 'Non_commencee',
      // dateField,
      // dateField1,
    };
    setError(''); // Réinitialiser les erreurs si tout est bon
    console.log('form data',formData)

    onAdd(formData);
    setDescription('');
    setContact('');
    // setDateField('');
    // setDateField1('');
    console.log('Form Data:', formData);
   // alert(initialValues?.id ? 'Application mise à jour avec succès !' : 'Application créée avec succès !');
  };

  return (
    open && (
      <form className="mr-3 ml-2 pr-4 pl-5 mt-3 relative pb-10 bg-gray-100 w-full" onSubmit={handleSubmit}>
        <div className="flex justify-end">
          <button
            className="border-none bg-transparent p-0 text-[30px] font-medium text-gray-800 cursor-pointer hover:text-red-500"
            type="button"
            onClick={handleClose}
          >
            &times;
          </button>
          
        </div>

        <p className="font-medium mb-8 text-lg">{title}</p>
        <div className="flex flex-row gap-7 ">
          <div className='w-[60%] '>
            <InputForm
              type="text"
              label="Description"
              placeholder="Entrez la description de la remédiation..."
              width="100%"
              required={true}
              flexDirection="flex-row gap-5 items-center mb-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <InputForm
              type="email"
              label="Contact"
              placeholder="Entrez l'e-mail de la personne concernée..."
              width="100%"
              required={true}
              flexDirection="flex-row gap-12 items-center mb-2"
              value={owner_cntct}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          {/* <div className='w-[35%] '>
            <InputForm
              type="date"
              label="Date Début"
              width="50%"
              required={true}
              flexDirection="flex-row gap-9 items-center mb-2"
              value={dateField}
              onChange={(e) => setDateField(e.target.value)}
            />
            <InputForm
              type="date"
              label="Date Fin"
              width="50%"
              required={true}
              flexDirection="flex-row gap-14 items-center mb-2"
              value={dateField1}
              onChange={handleDateField1Change} // Utiliser la nouvelle fonction de gestion
              min={dateField} // L'attribut min est défini sur la date de début
            />
          </div> */}
        </div>

        {/* Afficher l'erreur si les dates ne sont pas valides */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="absolute bottom-0 right-2">
          <button
            className="px-4 mr-5  mb-4 py-1 bg-[var(--blue-menu)] text-white border-none rounded hover:bg-blue-700"
            type="submit"
          >
            Créer
          </button>
        </div>
      </form>
    )
  );
}

export default Remediation;
