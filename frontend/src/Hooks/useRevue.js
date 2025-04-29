import { useState, useEffect } from "react";
import { api } from "../Api"; 
import { useNavigate } from "react-router-dom";

const useRevue = (activeView) => {
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [revueMissionData, setRevueMissionData] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);

    // Fetch missions based on active view (manager/superviseur)
    useEffect(() => {
        const fetchMissions = async () => {
            setLoading(true);
            try {
                const endpoint =
                    activeView === "manager"
                        ? "/revue/getmissionexecutionreviewedforManager"
                        : "/revue/getmissionexecutionreviewedforSuperviseur";

                const response = await api.get(endpoint);
                const missions = response.data || [];
                setRevueMissionData(missions);
                console.log("gestion revue", response.data)
                setFilteredRows(missions);
            } catch (err) {
                setError("Erreur lors du chargement des missions à revoir.");
            } finally {
                setLoading(false);
            }
        };

        fetchMissions();
    }, [activeView]);


    const fetchRevueExecutions = async (missionRevueData) => {
        setLoading(true);
        try {
            let response;

            if (missionRevueData.profileName === 'superviseur') {
                response = await api.get(`/revue/${missionRevueData.id}/getexecutionreviewedforSuperviseur`);
            } else if (missionRevueData.profileName === 'manager') {
                response = await api.get(`/revue/${missionRevueData.id}/getexecutionreviewedforManager`);
            } else {
                throw new Error("Profil non pris en charge pour la revue.");
            }

            return response?.data || [];
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (rowData) => {
        navigate(`/revue/${rowData.missionName}`, { state: { missionRevueData: rowData } });
        console.log('Détails du mission revue sélectionné:', rowData);
    };
    return { 
        loading,
        error,
        revueMissionData,
        setRevueMissionData,
        filteredRows,
        setFilteredRows,
        fetchRevueExecutions,
        handleRowClick,

    };
};

export default useRevue;