import { useState, useEffect } from "react";
import { api } from "../Api"; // Instance Axios
import { useAuth } from "../Context/AuthContext"; // Contexte d'authentification
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useStatistics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const missionId=7;
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
      const response = await api.get(`/missions/${missionId}/report`);
      const data = response.data;
      console.log("data",data.layer)

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
      toast.error("Échec du chargement du rapport.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (missionId) {
      getMissionreport();
    }
  }, [missionId]);

  return {
    loading,
    error,
    missionStatistics
  };
};

export default useStatistics;
