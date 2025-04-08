import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, api } from "../Api"; // Importer l'instance Axios pour les requêtes authentifiées
import { toast } from "react-toastify";
import { useRef, useEffect } from "react";


const AuthContext = createContext(null);

// Configurez les intercepteurs UNE FOIS au niveau module (hors composant)
const configureInterceptors = () => {
  const injectToken = (config) => {
    const token = localStorage.getItem("token");
    const publicEndpoints = [
      "/check-email",
      "/store-reset-code",
      "/verify-reset-code", 
      "/reset-password",
    ];
    
    if (token && !publicEndpoints.includes(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  // Configuration permanente des intercepteurs
  authApi.interceptors.request.use(injectToken);
  api.interceptors.request.use(injectToken);
};

// Appel initial de configuration
configureInterceptors();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getCurrentToken = () => localStorage.getItem("token");

  // Vérification initiale au montage
  useEffect(() => {
    const token = getCurrentToken();
    const expiry = localStorage.getItem("token_expiry");

    if (!token || !expiry || new Date().getTime() > parseInt(expiry)) {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiry");
      setUser(null);
      navigate("/login");
    }
  }, [navigate]);
  const loginUser = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/login", credentials);
      if (response.data?.token) {
        const expirationTime = new Date().getTime() + 120 * 60 * 1000;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("token_expiry", expirationTime);
        setUser(response.data.user || null);
      }
      return response.data;
    } catch (error) {
      console.log("erreur",error);
      if (error.response?.status === 401) {
        setError("Identifiants incorrects.");
      } else if (error.response?.status === 403) {
        setError("Votre compte est temporairement bloqué. Veuillez contacter l'administrateur.");
      } else if(error.response?.status === 422) {
        setError(error.response.data.data.password[0])
      }
      
      else {
        setError("Échec de la connexion");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/logout");
      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        setUser(null);
        toast.success("Déconnexion réussie !");
        navigate("/login");
      }
    } catch (error) {
      setError("Erreur lors de la déconnexion.");
      toast.error("Échec de la déconnexion !");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.get("/user");
      setUser(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des informations utilisateur.");
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

 
 
  


 
  

  return (
    <AuthContext.Provider
      value={{
        token: getCurrentToken(),
                user,
        loginUser,
        logout,
        changePassword,
        fetchUser,
        loading,
        error,
        forgotPasswordChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
