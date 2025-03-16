import { useState } from "react";
import { authApi } from "../Api"; // Importer l'instance Axios

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkEmail = async (body) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/check-email", body);
      return { success: true, data: response.data }; // Retourne un objet structuré
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Échec de vérification de l'email.";
      setError(errorMessage);
      return { success: false, error: errorMessage }; // Retourne l'erreur au lieu de la jeter
    } finally {
      setLoading(false);
    }
  };


  const storeVerificationCode = async (body) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/store-reset-code", body);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erreur lors de l'enregistrement du code.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (body) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/verify-reset-code", body);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Code invalide.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    checkEmail,
    loading,
    error,
    storeVerificationCode,
    verifyCode
  };
};

export default useAuth;
