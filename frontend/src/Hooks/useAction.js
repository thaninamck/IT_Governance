import { useCallback, useEffect, useState } from "react";
import { api, fileApi } from "../Api";

import emailjs from "emailjs-com";
emailjs.init("oAXuwpg74dQwm0C_s");

export default function useAction(initialRemediationData) {


    const [isSavingSuivi, setIsSavingSuivi] = useState(false);
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);
    const [actionData, setActionData] = useState({
        description: '',
        suivi: '',
        ownerContact: '',
        statusName: '',
        startDate: '',
        endDate: '',
        files: [],
        fileToDelete: null
    });

    // Chargement des données initiales
    const fetchActionData = useCallback(async (remediationId) => {
        try {
            const response = await api.get(`/execution/getRemediation/${remediationId}`);
            setActionData({
                ...response.data,
                files: response.data.remediation_evidences || []
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStatusOptions = useCallback(async () => {
        try {
            const res = await api.get("/remediation/get-options");
            setStatusOptions(res.data.map(status => ({
                value: status.id,
                label: status.status_name
            })));
        } catch (err) {
            console.error("Erreur de récupération des statuts :", err);
        }
    }, []);

    useEffect(() => {
        if (initialRemediationData.id) {
            fetchActionData(initialRemediationData.id);
        }
        fetchStatusOptions();
    }, [initialRemediationData.id, fetchActionData, fetchStatusOptions]);

    // Gestion de la sauvegarde
    const handleSave = useCallback(async () => {
        try {
            const transformedremediation = {
                id: actionData.id,
                description: actionData.description,
                owner_cntct: actionData.ownerContact,
                follow_up: actionData.suivi,
                start_date: actionData.startDate,
                end_date: actionData.endDate,
            };

            const formData = new FormData();
            Object.entries(transformedremediation).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const response = await api.put(`mission/${initialRemediationData.missionId}/app/${initialRemediationData.systemId}/execution/updateRemediation/${actionData.id}`, formData);
            return response.data;
        } catch (err) {
            console.error('Erreur lors de la sauvegarde:', err);
            setError('Erreur lors de la sauvegarde');
            throw err;
        }
    }, [actionData]);

    // Gestion du suivi (auto-save)
    const handleSaveSuivi = useCallback(async (suiviValue) => {
        if (!actionData.id) return;

        setIsSavingSuivi(true);
        try {
            await api.put(`mission/${initialRemediationData.missionId}/app/${initialRemediationData.systemId}/execution/updateRemediation/${actionData.id}`, {
                follow_up: suiviValue
            });
        } catch (err) {
            console.error('Erreur sauvegarde suivi:', err);
        } finally {
            setIsSavingSuivi(false);
        }
    }, [actionData.id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (actionData.id) {
                handleSaveSuivi(actionData.suivi);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [actionData.suivi, handleSaveSuivi, actionData.id]);

    // Gestion des fichiers
    const handleSaveFiles = useCallback(async (formData) => {
        const formDataToSend = new FormData();
        const remediation_id = actionData.id;

        let index = 0;
        for (const [key, file] of formData.entries()) {
            formDataToSend.append(`files[${index}]`, file);
            formDataToSend.append(`files[${index}][remediation_id]`, remediation_id);
            index++;
        }

        try {
            const response = await fileApi.post(`/remediationevidences/upload`, formDataToSend);
            if (response.status === 200 && Array.isArray(response.data)) {
                setActionData(prev => ({
                    ...prev,
                    files: [...(prev.files || []), ...response.data]
                }));
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de l'upload des fichiers:", error);
            setError("Échec de l'upload des fichiers.");
            throw error;
        }
    }, [actionData.id]);

    const handleDeleteConfirm = useCallback(async () => {
        setOpenDeletePopup(false);
        const fileToDelete = actionData.fileToDelete;

        try {
            const response = await api.delete(`/remediationevidences/delete-evidence/${fileToDelete.id}`);
            if (response.status === 200 || response.status === 204) {
                setActionData(prev => ({
                    ...prev,
                    files: prev.files.filter(f => f.id !== fileToDelete.id),
                    fileToDelete: null
                }));
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la suppression des fichiers:", error);
            setError("Échec de la suppression des fichiers.");
            throw error;
        }
    }, [actionData.fileToDelete]);

    const handleDelete = useCallback((index) => {
        const deletedFile = actionData.files[index];
        setActionData(prev => ({
            ...prev,
            fileToDelete: deletedFile
        }));
        setOpenDeletePopup(true);
    }, [actionData.files]);


    return {
        actionData,
        setActionData,
        isSavingSuivi,
        loading,
        error,
        statusOptions,
        openDeletePopup,
        setOpenDeletePopup,
        handleSave,
        handleSaveFiles,
        handleDelete,
        handleDeleteConfirm,
        fetchActionData

    };
}
