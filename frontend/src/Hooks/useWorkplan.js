import { useState, useEffect } from "react";
import { api } from "../Api"; // Instance Axios
import { useAuth } from "../Context/AuthContext"; // Contexte d'authentification
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const useWorkplan = () => {
  const {id}=useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [controls, setControls] = useState([]);
  const [risks, setRisks] = useState([]);
  const [executions, setExecutions] = useState([]);
  const fetchOptions = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/missions/${id}/workplanOptions`);
      const data = response.data;

      setApplications(data.applications);
      setRisks(data.risks);
      setControls(data.controls);

    } catch (err) {
      setError(err);
      //toast.error("Erreur lors de la récupération des options du plan de travail.");
    } finally {
      setLoading(false);
    }
  };


  const createExecutions = async (executionsData) => {
    setLoading(true);
    try {
      // Formater les données comme requis par l'API
      //const formattedData = { executions: executionsData };

      const response = await api.post(`/missions/${id}/insert-executions`, executionsData);
      setExecutions(response.data); 
      toast.success("Controles ajoutées avec succès.");
    } catch (err) {
      setError(err);
      console.error("Erreur lors de l'envoi des exécutions:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    //const missionId = 1; 
    fetchOptions(id);
  }, []); 
  return {
    loading,
    error,
    applications,
    risks,
    controls,
    createExecutions,
  };
};

export default useWorkplan;
