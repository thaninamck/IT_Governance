import React, { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SingleOptionSelect from '../Selects/SingleOptionSelect';

const AddEquipe = () => {
  const [collaborators, setCollaborators] = useState([]); // Liste des collaborateurs

  // Données pour les membres et les rôles
  const members = [
    [1, 'Os'],
    [2, 'Bdd'],
    [3, 'NA'],
  ];

  const roles = [
    [1, 'Os'],
    [2, 'Bdd'],
    [3, 'NA'],
  ];

  // Ajouter un collaborateur vide à la liste
  const handleAddCollaborator = () => {
    setCollaborators([...collaborators, { member: null, role: null }]);
  };

  // Mettre à jour la sélection d'un membre pour un collaborateur spécifique
  const handleMemberChange = (index, id, name) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index].member = { id, name };
    setCollaborators(updatedCollaborators);
  };

  // Mettre à jour la sélection d'un rôle pour un collaborateur spécifique
  const handleRoleChange = (index, id, name) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index].role = { id, name };
    setCollaborators(updatedCollaborators);
  };

  // Afficher les données sélectionnées (pour vérification)
  const handleSubmit = () => {
    console.log('Collaborateurs:', collaborators);
  };

  return (
    <>
      {/* Section pour l'équipe */}
      <div className="flex items-center mt-4">
        <label htmlFor="Equipe" className="text-font-gray font-medium w-[300px]">
          Équipe:
        </label>

        <div className="flex items-center gap-2">
          <div className='flex flex-col gap-x-2 items-center'>
            {/* Affiche "Ajouter des collaborateurs" au début seulement */}
            {collaborators.length === 0 && (
              <div className='flex gap-x-2 items-center'>
                <AddCircleOutlineIcon
                  sx={{ color: 'var(--blue-menu)', width: '30px', height: '30px', cursor: 'pointer' }}
                  onClick={handleAddCollaborator}
                />
                <p className="text-blue-menu text-base font-medium">Ajouter des collaborateurs</p>
              </div>
            )}

            {/* Affiche les collaborateurs ajoutés */}
            {collaborators.map((collaborator, index) => (
              <div key={index} className='flex gap-x-2 items-center'>
                {/* Sélection du membre */}
                <SingleOptionSelect
                  placeholder="Membre"
                  width={250}
                  statuses={members}
                  onChange={(id, name) => handleMemberChange(index, id, name)}
                  checkedStatus={[]}
                />

                {/* Sélection du rôle */}
                <SingleOptionSelect
                  placeholder="Rôle"
                  width={90}
                  statuses={roles}
                  onChange={(id, name) => handleRoleChange(index, id, name)}
                  checkedStatus={[]}
                />

                {/* Affiche le bouton "Ajouter un autre collaborateur" uniquement pour le dernier collaborateur */}
                {index === collaborators.length - 1 && (
                  <AddCircleOutlineIcon
                    sx={{ color: 'var(--blue-menu)', width: '20px', height: '20px', cursor: 'pointer' }}
                    onClick={handleAddCollaborator}
                  />
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