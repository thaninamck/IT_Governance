import { useCallback, useEffect, useState } from 'react';
import { api } from '../Api';


export const useDashboard = () => {
    const [missionData, setMissionData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMissionsDashboard = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/dashboard');
            setMissionData(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des missions :", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMissionsDashboard();
    }, [fetchMissionsDashboard]);

    return { missionData, loading, fetchMissionsDashboard };
};
