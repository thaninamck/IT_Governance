import { createContext, useContext, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../Api"; // Importer l'instance Axios pour les requêtes authentifiées

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // État pour le token
  const [user, setUser] = useState(null); // État pour les informations de l'utilisateur
  const [loading, setLoading] = useState(false); // État pour le chargement
  const [error, setError] = useState(null); // État pour les erreurs
  const navigate = useNavigate();
/*useEffect(() => {
  
  if(!token||!user){
  navigate('/login');}
}
,[token,user]);*/
  // 🔹 Connexion
  const loginUser = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/login", credentials);
      if (response.data?.token) {
        setToken(response.data.token); // Stocker le token dans le contexte
        setUser(response.data.user || null); // Stocker les informations de l'utilisateur
        console.log(response.data.user );
      }else
      return response.data;
    } catch (error) {
      setError("Échec de la connexion.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Déconnexion
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authApi.post("/logout"); // Envoyer une requête de déconnexion au backend
      setToken(null); // Supprimer le token du contexte
      setUser(null); // Supprimer les informations de l'utilisateur
    } catch (error) {
      setError("Erreur lors de la déconnexion.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  
  const forgotPasswordChange = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/reset-password", data); // Envoyer une requête pour changer le mot de passe
      return response.data.message;
    } catch (error) {
      setError("Erreur lors du changement de mot de passe.");
      throw error.response?.data?.message || "Erreur inconnue";
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/changePassword", data); // Envoyer une requête pour changer le mot de passe
      return response.data.message;
    } catch (error) {
      setError("Erreur lors du changement de mot de passe.");
      throw error.response?.data?.message || "Erreur inconnue";
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Récupérer les informations de l'utilisateur
  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.get("/user"); // Endpoint pour récupérer les informations de l'utilisateur
      setUser(response.data); // Mettre à jour les informations de l'utilisateur
    } catch (error) {
      setError("Erreur lors de la récupération des informations de l'utilisateur.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

const publicEndpoints = [
  "/check-email",
  "/store-reset-code",
  "/verify-reset-code",
  "/reset-password",
];

authApi.interceptors.request.use((config) => {
  if (token && !publicEndpoints.includes(config.url)) {
    config.headers.Authorization = `Bearer ${token}`; 
    console.log("Token added to request:", token);
  } else {
    console.log("No token added for this request:", config.url);
  }
  return config;
});


  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loginUser,
        logout,
        changePassword,
        fetchUser,
        loading,
        error,
        forgotPasswordChange
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);