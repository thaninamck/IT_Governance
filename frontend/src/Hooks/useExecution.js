import { useState, useEffect } from "react";
import { api } from "../Api"; // Instance Axios
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
      toast.error("Failed to fetch status options");
    } finally {
      setLoading(false);
    }
  }
 useEffect(() => {
    fetchOptions();
  }, []);
  return { 
    loading,
    error,
   options,
    
    
    

};
};

export default useExecution;