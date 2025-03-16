import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext"; // Récupérer le token
import { authApi } from "../Api"; // Instance d'Axios pour les requêtes protégées

const useAuthApi = () => {
  const { token } = useAuth();  // Récupère le token depuis le contexte

  useEffect(() => {
    // Ajoute le token à chaque requête
    const requestInterceptor = authApi.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;  // Ajoute le token dans les en-têtes
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Nettoie l'intercepteur lors du démontage du composant
    return () => {
      authApi.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);  // S'exécute chaque fois que le token change

  return authApi;  // Renvoie l'instance d'Axios configurée
};

export default useAuthApi;
