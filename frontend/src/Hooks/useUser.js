import { useState, useEffect } from "react";
import { authApi } from "../Api"; // Importer l'instance Axios pour les requêtes authentifiées
import { useAuth } from "../Context/AuthContext"; // Importer le contexte d'authentification

const useClient = () => {
  const { token, user } = useAuth(); // Récupérer le token et les informations de l'utilisateur
  const [clients, setClients] = useState([]); // État pour stocker la liste des clients
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs

  // 🔹 Récupérer la liste des clients
  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.get("/clients"); // Endpoint pour récupérer les clients
      setClients(response.data); // Mettre à jour la liste des clients
    } catch (error) {
      setError("Erreur lors de la récupération des clients.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Ajouter un nouveau client
  const addClient = async (newClient) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/clients", newClient); // Endpoint pour ajouter un client
      setClients((prevClients) => [...prevClients, response.data]); // Mettre à jour la liste des clients
    } catch (error) {
      setError("Erreur lors de l'ajout du client.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Supprimer un client
  const deleteClient = async (clientId) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.delete(`/clients/${clientId}`); // Endpoint pour supprimer un client
      setClients((prevClients) => prevClients.filter((client) => client.id !== clientId)); // Mettre à jour la liste des clients
    } catch (error) {
      setError("Erreur lors de la suppression du client.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Charger les clients au montage du composant
  useEffect(() => {
    if (token) {
      fetchClients(); // Récupérer les clients si l'utilisateur est connecté
    }
  }, [token]);

  return {
    clients,
    fetchClients,
    addClient,
    deleteClient,
    loading,
    error,
    user, // Retourner les informations de l'utilisateur connecté
  };
};

export default useClient;

/*const { clients, fetchClients, addClient, deleteClient, loading, error, user } = useClient();

  // 🔹 Exemple : Ajouter un nouveau client
  const handleAddClient = async () => {
    const newClient = {
      name: "Nouveau Client",
      email: "client@example.com",
    };
    try {
      await addClient(newClient);
      console.log("Client ajouté avec succès !");
    } catch (error) {
      console.error("Erreur :", error);
    }
  };*/