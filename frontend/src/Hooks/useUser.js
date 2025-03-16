import { useState, useEffect } from "react";
import { api } from "../Api"; // Importer l'instance Axios pour les requêtes authentifiées
import { useAuth } from "../Context/AuthContext"; // Importer le contexte d'authentification
import { toast } from "react-toastify";
const useUser = () => {
  const { token, user } = useAuth(); // Récupérer le token et les informations de l'utilisateur
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/users"); // Récupération des utilisateurs depuis l'API
      
      // Transformation des données
      const transformedUsers = response.data.map(user => ({
          id: user.id,
          nom: user.firstName, // Concaténation du nom et du prénom
          prenom: user.firstName,
          grade: user.grade,
          email: user.email,
          contact: user.phoneNumber,
          dateField: user.createdAt.split('T')[0], // Extraction de la date sans l'heure
          dateField1: user.lastActivity.split(' ')[0], // Extraction de la date de la dernière activité
          status: user.isActive ? "Active" : "Bloqué"
      }));

      setFilteredRows(transformedUsers); // Mise à jour des utilisateurs dans le state
    } catch (error) {
      setError("Erreur lors de la récupération des utilisateurs.");
      console.error(error);
    } finally {
      setLoading(false);
    }
};


const handleDeleteRow = async (selectedRow) => {
  setSelectedAppId(selectedRow.id);
  setIsDeletePopupOpen(true);
};

const confirmDeleteApp = async () => {
  if (!selectedAppId) return;

  try {
    setLoading(true);
    setError(null);
    await api.delete(`/user/${selectedAppId}`); // Assure-toi que l'endpoint est bien `/users/` et non `/user/`
    setFilteredRows(prevRows => prevRows.filter(row => row.id !== selectedAppId));
    console.log(`Utilisateur ${selectedAppId} supprimé avec succès.`);
    toast.success("Utilisateur  supprimé avec succès")
    
  } catch (error) {
    setError("Erreur lors de la suppression de l'utilisateur.");
    console.error("Erreur lors de la suppression :", error);
    toast.error("Utilisateur ne peut pas etre supprimé ")

  } finally {
    setIsDeletePopupOpen(false);
    setSelectedAppId(null);
    setLoading(false);
  }
};


  

 

  // 🔹 Charger les clients au montage du composant
  useEffect(() => {
    //if (token) {
      fetchUsers(); // Récupérer les clients si l'utilisateur est connecté
    //}
  }, [token]);

  return {
    selectedAppId,
    setSelectedAppId,
    isDeletePopupOpen,
    setIsDeletePopupOpen,
    confirmDeleteApp,
    
    filteredRows,
    setFilteredRows,
    loading,
    error,
    handleDeleteRow,
    user, 
  };
};

export default useUser;

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