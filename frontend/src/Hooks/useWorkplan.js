import { useState, useEffect } from "react";
import { api } from "../Api"; // Instance Axios
import { useAuth } from "../Context/AuthContext"; // Contexte d'authentification
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useWorkplan = (missionId) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [controls, setControls] = useState([]);
  const [risks, setRisks] = useState([]);
  
  const fetchOptions = async (missionId) => {
    setLoading(true);
    try {
      const response = await api.get(`/missions/${missionId}/workplanOptions`);
      const data = response.data;

      setApplications(data.applications);
      setRisks(data.risks);
      setControls(data.controls);

    } catch (err) {
      setError(err);
      toast.error("Erreur lors de la récupération des options du plan de travail.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //const missionId = 1; 
    fetchOptions(missionId);
  }, []); 
  return {
    loading,
    error,
    applications,
    risks,
    controls,
  };
};

export default useWorkplan;
