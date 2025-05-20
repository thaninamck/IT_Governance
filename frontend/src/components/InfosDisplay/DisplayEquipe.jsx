import React, { useEffect, useState } from 'react';
import InfoDisplayComponent from './InfoDisplayComponent';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { toast } from 'react-toastify';
import { api } from '../../Api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';

const DisplayEquipe = ({ equipe: initialEquipe, missionId, onTeamUpdate, user,profileName }) => {  
  console.log("ppname",profileName)
  const [localEquipe, setLocalEquipe] = useState(initialEquipe);
  const [openDialog, setOpenDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  
  // Synchronisation avec les props parentes
  useEffect(() => {
    setLocalEquipe(initialEquipe);
  }, [initialEquipe]);

  const handleOpenDialog = (participationId) => {
    setMemberToDelete(participationId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMemberToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    
    try {
     
      setLocalEquipe(prev => prev.filter(m => m.id !== memberToDelete));
      
      const response = await api.delete(`/missions/${missionId}/deletemember/${memberToDelete}`);
      
      if (!response.data.success) {
        // Rollback si l'API échoue
        setLocalEquipe(initialEquipe);
        throw new Error('La suppression a échoué côté serveur');
      }

      toast.success('Membre supprimé avec succès');
      onTeamUpdate(); // Notifie le parent de rafraîchir les données
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(error.message || 'Erreur lors de la suppression du membre');
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center mt-4">
      <label htmlFor="Equipe" className="text-font-gray font-medium w-full sm:w-[300px] mb-2 sm:mb-0">
        Équipe:
      </label>

      <div className="flex flex-col sm:flex-wrap gap-4 sm:gap-x-6">
        {localEquipe.map((membre, index) => (
          <div key={index} className="flex flex-col justify-between sm:flex-row gap-2 sm:gap-6 items-start sm:items-center">
            <InfoDisplayComponent 
              BoxContent={membre.full_name} 
              borderWidth="220px" 
              labelWidth="100px" 
              label="Membre:" 
            />
            <InfoDisplayComponent 
              BoxContent={membre.profile.profile_name} 
              borderWidth="120px" 
              labelWidth="100px" 
              label="Rôle:" 
            />
            {(user?.role === "admin" || profileName==="manager") && (
              <DeleteOutlineIcon 
                sx={{ 
                  color: 'red', 
                  cursor: 'pointer',
                  '&:hover': { color: 'darkred' }
                }}
                onClick={() => handleOpenDialog(membre.id)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Dialog de confirmation */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold' }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
            sx={{ textTransform: 'none' }}
          >
            Confirmer la suppression
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DisplayEquipe;