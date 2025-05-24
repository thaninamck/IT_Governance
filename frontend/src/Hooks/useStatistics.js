import { useState, useEffect } from "react";
import { api } from "../Api"; // Instance Axios
import { useAuth } from "../Context/AuthContext"; // Contexte d'authentification
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useStatistics = (missionId) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [data,setData]=useState([])
  const [missionStatistics, setMissionStatistics] = useState({
    app: [],
    db: [],
    os: [],
    systeme: [],
    layer: {},
    global_score: 0,
    mission_adv: "0.0",
    apps_adv: []
  });

  const getMissionreport = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/missions/${missionId}/dsp-report`);
      const data = response.data;
      

      setMissionStatistics({
        app: data.app || [],
        db: data.db || [],
        os: data.os || [],
        systeme: data.systeme || [],
        layer:  Object.entries(missionStatistics.layer).map(([name, score]) => ({
            name,
            score
          }))
           || {},
        global_score: data.global_score || 0,
        mission_adv: data.mission_adv || "0.0",
        apps_adv: data.apps_adv || []
      });
    } catch (err) {
      console.error("Erreur lors de la récupération du rapport :", err);
      setError(err);
      setLoading(false);
      toast.error("Échec du chargement du rapport.");
    } finally {
      setLoading(false);
    }
  };


  const getAppReport = async (missionId,id) => {
    setLoading(true);
    try {
      const response = await api.get(`/missions/${missionId}/systems/${id}/system-report`);
      const data = response.data;
      console.log("izan",data)       
      setData(data)
      return data;
    } catch (err) {
      console.error("Erreur lors de la récupération du rapport :", err);
      setError(err);
      setLoading(false);
      toast.error("Échec du chargement du rapport.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (missionId) {
      getMissionreport();
     
    }
   
  }, []);

  return {
    loading,
    error,
    missionStatistics,
    data,
    getAppReport
  };
};

export default useStatistics;
