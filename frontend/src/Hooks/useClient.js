import { useState, useEffect } from 'react';
import {api }from '../Api';

// Hook personnalisé pour la gestion des clients
const useClient = () => {
    // État contenant la liste des clients filtrés
    const [filtereRows, setFiltereRows] = useState([]);
    // État pour gérer l'ouverture du modal d'ajout de client
    const [isModalOpen, setIsModalOpen] = useState(false);
    // État pour gérer l'ouverture du modal de modification de client
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // État contenant les informations du client sélectionné pour modification
    const [selectedClient, setSelectedClient] = useState(null);
    // État pour gérer l'affichage du popup de confirmation de suppression
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    // État stockant l'ID du client à supprimer
    const [selectedClientId, setSelectedClientId] = useState(null);

    // Fonction pour récupérer la liste des clients depuis le backend
    const fetchClients = async () => {
        try {
            // Envoi d'une requête GET pour obtenir la liste des clients
            const response = await api.get('/getclients');
            // Mise à jour de l'état avec les données reçues
            setFiltereRows(response.data);
            console.log('clients',filtereRows)
        } catch (error) {
            console.error('Erreur lors de la récupération des clients:', error);
        }
    };

    // Effet pour charger la liste des clients au montage du composant
    useEffect(() => {
        fetchClients();
    }, []);

    // Fonctions pour ouvrir et fermer le modal d'ajout de client
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Fonction pour ajouter un nouveau client
    const handleClientCreation = async (newClient) => {
        try {
            // Envoi d'une requête POST avec les données du nouveau client
            const response = await api.post('/createclient', newClient);
            // Ajout du nouveau client à la liste des clients affichés
            setFilteredRows(prevRows => [...prevRows, response.data.client]);
            // Fermeture du modal d'ajout
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erreur lors de la création du client:', error);
        }
    };

    // Fonction pour préparer la modification d'un client existant
    const handleEditRow = (selectedRow) => {
        // Transformation des clés de l'objet client pour correspondre à l'API
        const transformedClient = {
            id: selectedRow.id,
            commercial_name: selectedRow.commercialName,
            social_reason: selectedRow.socialReason,
            correspondence: selectedRow.correspondence,
            address: selectedRow.address,
            contact_1: selectedRow.contact1,
            contact_2: selectedRow.contact2,
        };
        // Stockage du client sélectionné pour modification
        setSelectedClient(transformedClient);
        // Ouverture du modal d'édition
        setIsEditModalOpen(true);
    };

    // Fonction pour mettre à jour un client existant
    const handleUpdateClient = async (updatedClient) => {
        try {
            // Envoi d'une requête PUT avec les nouvelles informations du client
            const response = await api.put(`/updateclientID/${updatedClient.id}`, updatedClient);
            // Mise à jour de la liste des clients affichés avec les nouvelles données
            setFilteredRows(prevRows =>
                prevRows.map(row => (row.id === updatedClient.id ? response.data : row))
            );
            // Fermeture du modal d'édition
            setIsEditModalOpen(false);
            setSelectedClient(null);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du client:', error);
        }
    };

    // Fonction pour ouvrir le popup de confirmation de suppression
    const handleDeleteRow = (selectedRow) => {
        setSelectedClientId(selectedRow.id);
        setIsDeletePopupOpen(true);
    };

    // Fonction pour confirmer et exécuter la suppression d'un client
    const confirmDeleteClient = async () => {
        if (selectedClientId !== null) {
            try {
                // Envoi d'une requête DELETE pour supprimer le client
                await api.delete(`/deleteclientID/${selectedClientId}`);
                // Suppression du client de la liste affichée
                setFilteredRows(prevRows => prevRows.filter(row => row.id !== selectedClientId));
            } catch (error) {
                console.error('Erreur lors de la suppression du client:', error);
            }
        }
        // Fermeture du popup de suppression
        setIsDeletePopupOpen(false);
        setSelectedClientId(null);
    };

    // Fonction pour fermer le popup de suppression
    const closeDeletePopup = () => {
        setIsDeletePopupOpen(false);
        setSelectedClientId(null);
    };

    // Retourne toutes les états et fonctions pour être utilisées dans les composants
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
    };
};


export default useClient;
