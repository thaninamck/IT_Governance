import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, api } from "../Api"; // Importer l'instance Axios pour les requêtes authentifiées
import { toast } from "react-toastify";
import { useRef, useEffect } from "react";

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const tokenRef = useRef(null);
  const [token, setToken] = useState(null); // État pour le token
  const [user, setUser] = useState(null); // État pour les informations de l'utilisateur
  const [loading, setLoading] = useState(false); // État pour le chargement
  const [error, setError] = useState(null); // État pour les erreurs
  const navigate = useNavigate();

  

  useEffect(() => {
    console.log("useEffect exécuté");
  
    const tokenRestored = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("token_expiry");
  
    console.log("Token récupéré :", tokenRestored);
    console.log("Expiration récupérée :", tokenExpiry);
  
    if (tokenRestored && tokenExpiry) {
      const now = new Date().getTime();
      console.log("Temps actuel :", now);
      console.log("Temps d'expiration :", parseInt(tokenExpiry));
  
      if (isNaN(tokenExpiry)) {
        console.error("Erreur : tokenExpiry n'est pas un nombre valide.");
        return;
      }
  
      if (now > parseInt(tokenExpiry)) {
        console.warn("Token expiré, suppression des données...");
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        setToken(null);
        setUser(null);
        navigate("/login"); // Redirige l'utilisateur si le token a expiré
      } else {
        console.log("Token encore valide, restauration...");
        console.log("tokenRestored",tokenRestored)
        setToken(tokenRestored);
        console.log("token est ",token)
      }
    } else {
      console.warn("Aucun token trouvé, redirection vers login...");
      setToken(null);
      setUser(null);
      navigate("/login");
    }
  }, []);
  
  

  // 🔹 Connexion
  const loginUser = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/login", credentials);
      console.log(response.data?.token)
      if (response.data?.token) {
        const expirationTime = new Date().getTime() + 120 * 60 * 1000; // 120 minutes en millisecondes (même valeur que Laravel)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("token_expiry", expirationTime);
        setToken(response.data.token);
        setUser(response.data.user || null);
      } else return response.data;
    } catch (error) {
      setError("Échec de la connexion.");
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
        setToken(null);
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
      setError(
        "Erreur lors de la récupération des informations de l'utilisateur."
      );
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

  

  useEffect(() => {
    tokenRef.current = token; // Met à jour la référence du token
  
    const requestInterceptorAuthApi = authApi.interceptors.request.use((config) => {
      if (tokenRef.current && !publicEndpoints.includes(config.url)) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`;
        console.log("🔑 [authApi] Token ajouté:", tokenRef.current);
      } else {
        console.log("⚠️ [authApi] Pas de token pour cette requête:", config.url);
      }
      return config;
    });
  
    const requestInterceptorApi = api.interceptors.request.use((config) => {
      if (tokenRef.current && !publicEndpoints.includes(config.url)) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`;
        console.log("🔑 [api] Token ajouté:", tokenRef.current);
      } else {
        console.log("⚠️ [api] Pas de token pour cette requête:", config.url);
      }
      return config;
    });
  
    return () => {
      authApi.interceptors.request.eject(requestInterceptorAuthApi);
      api.interceptors.request.eject(requestInterceptorApi);
    };
  }, [token]);

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
        forgotPasswordChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
