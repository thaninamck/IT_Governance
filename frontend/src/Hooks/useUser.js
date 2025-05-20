import { useState, useEffect } from "react";
import { api } from "../Api"; // Importer l'instance Axios pour les requêtes authentifiées
import { useAuth } from "../Context/AuthContext"; // Importer le contexte d'authentification
import { toast } from "react-toastify";
import emailjs from "emailjs-com";

const useUser = () => {
  const { token, user } = useAuth(); // Récupérer le token et les informations de l'utilisateur
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [ResetShow, setResetShow] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedUserToReset, setSelecteduserToReset] = useState({});

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // État pour gérer l'affichage du modal d'ajout d'utilisateur
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success", "error", "warning", "info"
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/users"); // Récupération des utilisateurs depuis l'API
console.log("user",response.data)
      // Transformation des données
      const transformedUsers = response.data.map((user) => ({
        id: user.id,
        nom: user.firstName, // Concaténation du nom et du prénom
        prenom: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        grade: user.position?.name,
        position_id:user.position?.id,
        email: user.email,
        contact: user.phoneNumber,
        lastPasswordChange: user.lastPasswordChange ? user.lastPasswordChange.split("T")[0] : "pas encore changé",
        dateField: user.createdAt.split("T")[0], // Extraction de la date sans l'heure
        dateField1: user.lastActivity.split(" ")[0], // Extraction de la date de la dernière activité
        status: user.isActive ? "Actif" : "Bloqué",
        role: user.role === 1 ? "Admin" : "Utilisateur normal",
      }));

      setFilteredRows(transformedUsers); // Mise à jour des utilisateurs dans le state
    } catch (error) {
      setError("Erreur lors de la récupération des utilisateurs.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/grades"); 
      return   response.data.map(grade => ({
        label: grade.name,  
        value: grade.id     
      }));
    } catch (error) {
      setError("Erreur lors de la récupération des grades.");
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
      setFilteredRows((prevRows) =>
        prevRows.filter((row) => row.id !== selectedAppId)
      );
      console.log(`Utilisateur ${selectedAppId} supprimé avec succès.`);
      toast.success("Utilisateur  supprimé avec succès");
    } catch (error) {
      setError("Erreur lors de la suppression de l'utilisateur.");
      console.error("Erreur lors de la suppression :", error);
      toast.error("Utilisateur ne peut pas etre supprimé ");
    } finally {
      setIsDeletePopupOpen(false);
      setSelectedAppId(null);
      setLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const length = 12; // Longueur du mot de passe
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleResetRow = (selectedRow) => {
    setSelecteduserToReset({
      email:selectedRow.email,
      new_password: generateRandomPassword(),
    });
    setResetShow(true);
    console.log("aqli i resret",selectedRow);
  };

  const handleResetConfirm = async () => {
    if (selectedUserToReset !== null) {
      

      try {
        setLoading(true);
        setError(null);

        // 🔹 Appel API pour mettre à jour le mot de passe
        console.log("user to reset",selectedUserToReset)
        await api.post(`/reset-user`, selectedUserToReset);
        //await api.post(`/reset-user/${selectedAppId}`);
        // 🔹 Envoi du mail avec le nouveau mot de passe
        await emailjs.send(
          "service_qm58mng",
          "template_g520ynb",
          { email: selectedUserToReset.email, password: selectedUserToReset.new_password },
          "jhF4FXcRjk6PSE78R"
        );

        setFilteredRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedAppId ? { ...row, password: newPassword } : row
          )
        );

        toast.success("Utilisateur réinitialisé avec succès !");
      } catch (error) {
        console.error("Erreur lors de la réinitialisation :", error);
        toast.error("Échec de la réinitialisation du mot de passe.");
      } finally {
        setLoading(false);
        setSnackbarOpen(true);
        setResetShow(false);
        setSelectedAppId(null);
      }
    }
  };

  
  const handleEditRow = (selectedRow) => {
    // const missionToEdit = filteredRows.find(row => row.id === rowId);
    setSelectedApp({ ...selectedRow }); // S'assurer que l'objet est bien copié
    setIsEditModalOpen(true);
    console.log("test", selectedRow);
  };

  const handleUpdateApp = async (updatedApp) => {
    if (!updatedApp || !updatedApp.id) return;

    const formattedApp = {
      first_name: updatedApp.prenom,
      last_name: updatedApp.nom,
      position_id: updatedApp.position_id,
      phone_number: updatedApp.contact,
      email: updatedApp.email,
      role: updatedApp.role === "Admin" ? 1 : 0,
      is_active: updatedApp.status === "Actif" ? true : false,
    };

    console.log("user to update", formattedApp);

    try {
      setLoading(true);
      setError(null);

      // 🔹 Appel API pour mettre à jour l'utilisateur
      const response = await api.put(
        `/update-user/${updatedApp.id}`,
        formattedApp
      );

      // Vérifier si la requête a réussi (status 200 ou 204)
      if (response.status === 200 || response.status === 204) {
        // 🔹 Mise à jour du state local après la modification
        setFilteredRows((prevRows) =>
          prevRows.map((row) =>
            row.id === updatedApp.id ? { ...row, ...updatedApp } : row
          )
        );

        toast.success("Utilisateur mis à jour avec succès !");

        // 🔹 Fermer la modal après succès
        setIsEditModalOpen(false);
        setSelectedApp(null);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      toast.error("Échec de la mise à jour de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  // Gestion de l'ajout d'un nouvel utilisateur
  const handleUserCreation = async (newUser) => {
    const formattedUser = {
      first_name: newUser.prenom,
      last_name: newUser.nom,
      position_id: newUser.position_id,
      phone_number: newUser.contact,
      email: newUser.email,
      password: newUser.password,
      is_active: newUser.status === "Actif" ? true : false,
      role: newUser.role === "Admin" ? 1 : 0,
    };

    try {
      setLoading(true);
      setError(null);
      console.log("user to create",formattedUser)
      const response = await api.post("/insert-user", formattedUser);
      console.log("response", response);
      setFilteredRows((prevRows) => [
        ...prevRows,
        { id: response.data.user.id, ...newUser },
      ]);
      await emailjs.send(
        "service_qm58mng",
        "template_g520ynb",
        { email: formattedUser.email, password: formattedUser.password },
        "jhF4FXcRjk6PSE78R"
      );
      toast.success("Utilisateur ajouté avec succès !");
    } catch (error) {
      console.log("Erreur lors de l'ajout :", error);

      if (error.response && error.response.status === 422) {
        const errors = error.response.data?.data;
        if (errors?.email) {
          toast.error("Cet email est déjà utilisé par un autre utilisateur.");
        } else {
          toast.error("Une erreur de validation est survenue.");
        }
      } else {
        toast.error("Échec de l'ajout de l'utilisateur.");
      }
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  // 🔹 Charger les clients au montage du composant
  useEffect(() => {
    //if (token) {
    fetchUsers(); // Récupérer les clients si l'utilisateur est connecté
    //}
  }, [token]);

  return {
    fetchUsers,
    selectedAppId,
    setSelectedAppId,
    isDeletePopupOpen,
    setIsDeletePopupOpen,
    confirmDeleteApp,
    ResetShow,
    setResetShow,
    snackbarMessage,
    setSnackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
    snackbarSeverity,
    setSnackbarSeverity,
    handleResetRow,
    handleResetConfirm,
    filteredRows,
    setFilteredRows,
    loading,
    error,
    handleDeleteRow,
    fetchGrades,
    isEditModalOpen,
    selectedApp,
    setIsEditModalOpen,
    setSelectedApp,
    handleEditRow,
    handleUpdateApp,
    handleUserCreation,
    isModalOpen,
    setIsModalOpen,
    user,
  };
};

export default useUser;
