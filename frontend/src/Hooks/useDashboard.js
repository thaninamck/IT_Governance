import { useCallback, useEffect, useState } from 'react';
import { api } from '../Api';

export const useDashboard = () => {
    const [missionData, setMissionData] = useState([]);
    const [missionReportData, setMissionReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [controlActionData, setControlActionData] = useState({});
    const [controlActionLoading, setControlActionLoading] = useState({});
    const [executionData, setExecutionData] = useState({
        allIneffective: [],
        displayed: [],
        selected: null
    });
    // Fetch missions dashboard
    const fetchMissionsDashboard = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/dashboard');
            //console.log("missions recuperees",response.data)
            setMissionData(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des missions :", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch mission report data
    const fetchMissionReport = useCallback(async (missionId) => {
        setLoading(true);
        try {
            const response = await api.get(`/missions/${missionId}/report`);
            setMissionReportData(response.data);
            console.log("Mission report data:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching mission report:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);
    // Fetch execution data
    const fetchExecutionData = useCallback(async (type, missionId, filter = null) => {
        setLoading(true);
        try {
            let endpoint = '';
            switch (type) {
                case 'effective': endpoint = `effective-controls`; break;
                case 'ineffective': endpoint = `ineffective-controls`; break;
                case 'began': endpoint = `began-controls`; break;
                case 'unbegan': endpoint = `unbegan-controls`; break;
                default: throw new Error('Unsupported data type');
            }

            const response = await api.get(`/dashboard/missions/${missionId}/${endpoint}`);
            const dataToSet = filter
                ? response.data.filter(item => item.status?.toLowerCase() === filter.toLowerCase())
                : response.data;

            setExecutionData(prev => ({
                ...prev,
                displayed: dataToSet,
                ...(type === 'ineffective' ? { allIneffective: response.data } : {})
            }));

            return dataToSet;
        } catch (error) {
            console.error(`Error fetching ${type} controls:`, error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Set selected item
    const setSelectedExecution = useCallback((item) => {
        setExecutionData(prev => ({
            ...prev,
            selected: item,
            displayed: [] // Reset displayed data when selecting new item
        }));
    }, []);

    const fetchControlActionData = useCallback(async (missionId, executionId) => {
        try {
            setControlActionLoading((prev) => ({ ...prev, [executionId]: true }));
    
            const response = await api.get(`/missions/${missionId}/report/executions/${executionId}`);
            const rawDataArray = response.data;
    
            const transformedArray = rawDataArray.map((raw) => ({
                action_name: raw.action_name,
                description: raw.description,
                end_date: raw.end_date,
                execution_id: raw.execution_id,
                follow_up: raw.follow_up,
                id: raw.id,
                owner_cntct: raw.owner_cntct,
                start_date: raw.start_date,
                status_name: raw.status?.status_name,
                entity: raw.status?.entity,
                status_id: raw.status_id,
            }));
    
            setControlActionData((prev) => ({
                ...prev,
                [executionId]: transformedArray,
            }));
        } catch (error) {
            console.error("Erreur lors de la récupération des données d'action de contrôle :", error);
        } finally {
            setControlActionLoading((prev) => ({ ...prev, [executionId]: false }));
        }
    }, []);

    useEffect(() => {
        fetchMissionsDashboard();
    }, [fetchMissionsDashboard]);

    return {
        missionData,
        loading,
        setExecutionData,
        missionReportData,
        executionData,
        fetchMissionReport,
        fetchMissionsDashboard,
        fetchExecutionData,
        setSelectedExecution,
        fetchControlActionData,
        controlActionData,
        controlActionLoading
    };
};
