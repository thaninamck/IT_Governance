import React, { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SingleOptionSelect from '../Selects/SingleOptionSelect';

const AddEquipe = ({ onAddCollaborators }) => {
  const [collaborators, setCollaborators] = useState([]); // Liste des collaborateurs
  const [errors, setErrors] = useState({});

  // Données pour les membres et les rôles
  const members = [
    [1, 'Azyadi Zouaghi'],
    [2, 'Sara Lounes'],
    [3, 'Kamelia Toubal'],
    [4, 'Houda Elmaouhab'],
    [5, 'Manel Mohand Ouali'],
    [6, 'Thanina Mecherak'],
    [7, 'Ikram Berihi'],
    [8, 'Selma Boughoufalah'],
  ];

  const roles = [
    [1, 'Manager'],
    [2, 'Supeviseur'],
    [3, 'Testeur'],
  ];

  // Ajouter un collaborateur vide à la liste
  const handleAddCollaborator = () => {
    setCollaborators([...collaborators, { member: null, role: null }]);
  };

    // Vérifier les erreurs en temps réel
  const validateCollaborators = (updatedCollaborators) => {
    const newErrors = {};

    updatedCollaborators.forEach((collab, index) => {
      // Vérifier si les champs sont vides
      if (!collab.member) {
        newErrors[index] = "Sélectionnez un membre.";
      } else if (!collab.role) {
        newErrors[index] = "Sélectionnez un rôle.";
      } else {
        // Vérifier les doublons
        const isDuplicate = updatedCollaborators.some(
          (otherCollab, otherIndex) =>
            index !== otherIndex &&
            collab.member?.id === otherCollab.member?.id &&
            collab.role?.id === otherCollab.role?.id
        );

        if (isDuplicate) {
          newErrors[index] = "Ce membre avec ce rôle est déjà ajouté.";
        }
      }
    });

    setErrors(newErrors);
  };


  
  // Mettre à jour la sélection d'un membre pour un collaborateur spécifique
  const handleMemberChange = (index, id, name) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index].member = { id, name };
    setCollaborators(updatedCollaborators);
    validateCollaborators(updatedCollaborators);
  };

  // Mettre à jour la sélection d'un rôle pour un collaborateur spécifique
  const handleRoleChange = (index, id, name) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index].role = { id, name };
    setCollaborators(updatedCollaborators);
    validateCollaborators(updatedCollaborators);
  };

  
// Soumission des collaborateurs
const handleSubmit = () => {
  if (Object.keys(errors).length > 0) {
    alert("Corrigez les erreurs avant de soumettre.");
    return;
  }

  if (collaborators.some(c => !c.member || !c.role)) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const formattedCollaborators = collaborators.map(c => ({
    membre: c.member.name,
    role: c.role.name,
  }));

  
    onAddCollaborators(formattedCollaborators);
    setCollaborators([]); // Réinitialiser après soumission
    setErrors({}); // Réinitialisation des erreurs
  };
  
  

  return (
    <>
      {/* Section pour l'équipe */}
      <div className="flex items-center ml-72  mt-4 ">
         {/* <label htmlFor="Equipe" className="text-font-gray font-medium w-[300px] ">
          Équipe:
        </label>  */}
    

        <div className="flex items-center gap-2  ">
          <div className='flex flex-col gap-x-2  items-left'>
            {/* Affiche "Ajouter des collaborateurs" au début seulement */}
            {collaborators.length === 0 && (
              <div className='flex gap-x-2 items-center cursor-pointer' onClick={handleAddCollaborator}>
                <AddCircleOutlineIcon
                  sx={{ color: 'var(--blue-menu)', width: '30px', height: '30px', cursor: 'pointer' }}
                  
                />
                <p className="text-blue-menu text-base font-medium">Ajouter des collaborateurs</p>
              </div>
            )}

            {/* Affiche les collaborateurs ajoutés */}
           {/* Affichage des collaborateurs */}
           {collaborators.map((collaborator, index) => (
              <div key={index} className="flex flex-col gap-1">
                <div className="flex gap-x-2 items-center">
                  <SingleOptionSelect
                    placeholder="Membre"
                    width={250}
                    statuses={members}
                    onChange={(id, name) => handleMemberChange(index, id, name)}
                    checkedStatus={[]}
                  />
                  <SingleOptionSelect
                    placeholder="Rôle"
                    width={90}
                    statuses={roles}
                    onChange={(id, name) => handleRoleChange(index, id, name)}
                    checkedStatus={[]}
                  />
                  {index === collaborators.length - 1 && (
                    <AddCircleOutlineIcon
                      sx={{ color: 'var(--blue-menu)', width: '20px', height: '20px', cursor: 'pointer' }}
                      onClick={handleAddCollaborator}
                    />
                  )}
                </div>
                {/* Message d'erreur */}
                {errors[index] && (
                  <p className="text-[var(--alert-red)] text-xs">{errors[index]}</p>
                )}
              </div>
            ))}




      
            {/* Bouton pour soumettre les données */}
           { collaborators.length !== 0 && (
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-menu text-white rounded-xl"
      >
        Soumettre
      </button>)}
          </div>
        </div>


      </div>

      
    </>
  );
};

export default AddEquipe;