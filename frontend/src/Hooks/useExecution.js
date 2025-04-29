import { useState, useEffect } from "react";
import { api,fileApi } from "../Api"; // Instance Axios
import { useAuth } from "../Context/AuthContext"; // Contexte d'authentification
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useExecution = () => {
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const [options, setOptions] = useState([]);
 
 const fetchOptions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/executions/get-options");
      setOptions(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const getExecutionById =  async ($missionId,$id) => {
        setLoading(true);
        try {
        const response = await api.get(`missions/${$missionId}/executions/get-execution/${$id}`);
        return response.data;
        } catch (error) {
        setError(error);
        //toast.error("Failed to fetch execution");
        } finally {
        setLoading(false);
        }
    };

    const getFileURL = `http://127.0.0.1:8000/storage/evidences/`;
      
    const deleteEvidence = async (evidenceId) => {
        setLoading(true);
        try {
            const response = await api.delete(`/evidences/delete-evidence/${evidenceId}`);
           // toast.success("Evidence deleted successfully");
            return response.status;
        } catch (error) {
            setError(error);
            toast.error("Failed to delete evidence");
        } finally {
            setLoading(false);
        }
    };

    const uploadEvidences = async (data) => {
        setLoading(true);
        try {
            const response = await fileApi.post(`/evidences/upload`, data);
            toast.success("Evidences ajoutés avec succees");
            return response;
        } catch (error) {
            setError(error);
            toast.error("Failed to upload evidence");
        } finally {
            setLoading(false);
        }
    };

    const updateExecution = async (executionId,data) => {
        setLoading(true);
        try {
            const response = await api.put(`/executions/update-execution/${executionId}`, data);
            toast.success("Mis à jour avec succées");
            return response;
        } catch (error) {
            setError(error);
            toast.error("Erreur lors de sauvegarde des modifications veuillez réssayer");
        } finally {
            setLoading(false);
        }
    }



    const submitExecutionForReview = async (executionId) => {
        setLoading(true);
        try {
          const response = await api.patch(`/executions/submit-execution-for-review/${executionId}`);
          toast.success("Soumis pour revue !");
          return response.data;
        } catch (error) {
          setError(error);
          toast.error("Échec de la soumission pour revue");
        } finally {
          setLoading(false);
        }
      };
      
      const submitExecutionForValidation = async (executionId) => {
        setLoading(true);
        try {
          const response = await api.patch(`/executions/submit-execution-for-validation/${executionId}`);
          toast.success("Soumis pour validation !");
          return response.data;
        } catch (error) {
          setError(error);
          toast.error("Échec de la soumission pour validation");
        } finally {
          setLoading(false);
        }
      };
      
      const createComment = async (commentData) => {
        setLoading(true);
        try {
          const response = await api.post("/executions/create-comment", commentData);
          toast.success("Commentaire ajouté !");
          return response.status;
        } catch (error) {
          setError(error);
          toast.error("Échec de l'ajout du commentaire");
        } finally {
          setLoading(false);
        }
      };
      

     
const deleteComment = async (commentId) => {
  setLoading(true);
  try {
    const response = await api.delete(`/executions/delete-comment/${commentId}`);
    toast.success("Commentaire supprimé !");
    return response.status;
  } catch (error) {
    setError(error);
    toast.error("Erreur lors de la suppression du commentaire");
  } finally {
    setLoading(false);
  }
};

// Modifier un commentaire
const editComment = async (commentId, newText) => {
  setLoading(true);
  try {
    const response = await api.put(`/executions/update-comment/${commentId}`, {
      text: newText,
    });
    
    return response.status;
  } catch (error) {
    setError(error);
    console.log(error)
    toast.error("Erreur lors de la modification du commentaire");
  } finally {
    setLoading(false);
  }
};


 useEffect(() => {
    fetchOptions();
  }, []);
  return { 
    loading,
    error,
   options,
   getExecutionById,
   getFileURL,
   deleteEvidence,
    uploadEvidences,
    updateExecution,
    submitExecutionForReview,
    submitExecutionForValidation,
    createComment,
    deleteComment,
    editComment,
    

};
};

export default useExecution;