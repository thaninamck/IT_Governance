import { useState, useEffect } from 'react';
import { api } from '../Api';
import { toast } from 'react-toastify';

// Hook personnalisé pour la gestion des clients
const useClient = () => {
    const [filtereRows, setFiltereRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await api.get('/getclients');
            setFiltereRows(response.data);
        } catch (error) {
            toast.error('Erreur lors de la récupération des clients');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleClientCreation = async (newClient) => {
        setLoading(true);
        try {
            const response = await api.post('/createclient', newClient);
            setFiltereRows(prev => [...prev, response.data.client]);
            toast.success("Client créé avec succès !");
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Erreur lors de la création du client !");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditRow = (selectedRow) => {
        const transformedClient = {
            id: selectedRow.id,
            commercial_name: selectedRow.commercialName,
            social_reason: selectedRow.socialReason,
            correspondence: selectedRow.correspondence,
            address: selectedRow.address,
            contact_1: selectedRow.contact1,
            contact_2: selectedRow.contact2,
        };
        setSelectedClient(transformedClient);
        setIsEditModalOpen(true);
    };

    const handleUpdateClient = async (updatedClient) => {
        setLoading(true);
        try {
            const response = await api.put(`/updateclientID/${updatedClient.id}`, updatedClient);
            setFiltereRows(prev =>
                prev.map(row => (row.id === updatedClient.id ? response.data : row))
            );
            toast.success("Client mis à jour avec succès !");
            setIsEditModalOpen(false);
            setSelectedClient(null);
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du client !");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRow = (selectedRow) => {
        setSelectedClientId(selectedRow.id);
        setIsDeletePopupOpen(true);
    };

    const confirmDeleteClient = async () => {
        if (selectedClientId !== null) {
            setLoading(true);
            try {
                await api.delete(`/deleteclientID/${selectedClientId}`);
                setFiltereRows(prev => prev.filter(row => row.id !== selectedClientId));
                toast.success("Client supprimé avec succès !");
            } catch (error) {
                toast.error("Erreur lors de la suppression du client !");
                console.error(error);
            } finally {
                setLoading(false);
                setIsDeletePopupOpen(false);
                setSelectedClientId(null);
            }
        }
    };

    const closeDeletePopup = () => {
        setIsDeletePopupOpen(false);
        setSelectedClientId(null);
    };

    return {
        filtereRows,
        setFiltereRows,
        isModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        selectedClient,
        isDeletePopupOpen,
        selectedClientId,
        openModal,
        closeModal,
        handleClientCreation,
        handleEditRow,
        handleUpdateClient,
        handleDeleteRow,
        confirmDeleteClient,
        closeDeletePopup,
        fetchClients,
        loading,
    };
};

export default useClient;
