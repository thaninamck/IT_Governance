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

  const getExecutionById =  async ($id) => {
        setLoading(true);
        try {
        const response = await api.get(`/executions/get-execution/${$id}`);
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
    
    

};
};

export default useExecution;