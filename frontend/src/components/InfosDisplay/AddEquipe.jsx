import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SingleOptionSelect from '../Selects/SingleOptionSelect';
import { api } from '../../Api';
import useUser from '../../Hooks/useNotification';

const AddEquipe = ({ missionId, onMemberAdded }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [errors, setErrors] = useState({});
  const [members, setMembers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const usersResponse = await api.get('/users');
        const formattedMembers = usersResponse.data.map(user => [
          user.id,
          `${user.firstName} ${user.lastName}`
        ]);
        setMembers(formattedMembers);
        
        const profilesResponse = await api.get('/getprofils');
        const formattedProfiles = profilesResponse.data.map(profile => [
          profile.id,
          profile.profileName || profile.profile_name
        ]);
        setProfiles(formattedProfiles);
        
      } catch (err) {
        setError(err.message);
        console.error("Erreur lors du chargement des données:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCollaborator = () => {
    setCollaborators([...collaborators, { member: null, role: null }]);
  };

  const handleCancel = () => {
    setCollaborators([]);
    setErrors({});
  };

  const validateCollaborators = (updatedCollaborators) => {
    const newErrors = {};

    updatedCollaborators.forEach((collab, index) => {
      if (!collab.member) {
        newErrors[index] = "Sélectionnez un membre.";
      } else if (!collab.role) {
        newErrors[index] = "Sélectionnez un rôle.";
      } else {
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

  const handleMemberChange = (index, id, name) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index].member = { id, name };
    setCollaborators(updatedCollaborators);
    validateCollaborators(updatedCollaborators);
  };

  const handleRoleChange = (index, id, name) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index].role = { id, name };
    setCollaborators(updatedCollaborators);
    validateCollaborators(updatedCollaborators);
  };

  const handleSubmit = async () => {
    if (Object.keys(errors).length > 0) {
      alert("Corrigez les erreurs avant de soumettre.");
      return;
    }

    if (collaborators.some(c => !c.member || !c.role)) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const membersToAdd = collaborators.map(c => ({
        user_id: c.member.id,
        profile_id: c.role.id
      }));

      const response = await api.post(`/missions/${missionId}/createmembers`, {
        members: membersToAdd
      });

      const newMembers = response.data.map(member => ({
        full_name: member.full_name,
        profile: {
          profile_name: member.profile_name
        }
      }));

      newMembers.forEach(member => {
        onMemberAdded(member);
      });

      setCollaborators([]);
      setErrors({});
      
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'ajout");
    }
  };
  
  return (
    <>
      <div className="flex items-center ml-72 mt-4">
        <div className="flex items-center gap-2">
          <div className='flex flex-col gap-x-2 items-left'>
            {collaborators.length === 0 && (
              <div className='flex gap-x-2 items-center cursor-pointer' onClick={handleAddCollaborator}>
                <AddCircleOutlineIcon
                  sx={{ color: 'var(--blue-menu)', width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <p className="text-blue-menu text-base font-medium">Ajouter des collaborateurs</p>
              </div>
            )}

            {collaborators.map((collaborator, index) => (
              <div key={index} className="flex flex-col gap-1 ">
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
                    statuses={profiles}
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
                {errors[index] && (
                  <p className="text-[var(--alert-red)] text-xs">{errors[index]}</p>
                )}
              </div>
            ))}

            {collaborators.length !== 0 && (
              <div className="flex justify-between w-[94%] mt-4  p-4">
                <button
                  onClick={handleCancel}
                  className="px-4  w-[45%] bg-[var(--alert-red)] text-white border-none rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 w-[45%]  py-2 bg-blue-menu text-white rounded-xl  border-none hover:bg-blue-700 transition-colors"
                >
                  Soumettre
                </button>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEquipe;