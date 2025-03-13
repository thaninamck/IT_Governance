import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import useAuthApi from "../Hooks/useAuthApi"; // ✅ Utilisation du hook

const useAuth = () => {
  const { token, loginUser, logout, loading, error } = useContext(AuthContext);
  const authApi = useAuthApi(); // ✅ Récupère `authApi` avec le token inclus

  // 🔹 Changement de mot de passe
  const changePassword = async (data) => {
    try {
      const response = await authApi.post("/changePassword", data);
      return response.data.message;
    } catch (error) {
      return "Erreur lors du changement de mot de passe";
    }
  };

  return { token, loginUser, logout, changePassword, loading, error };
};

export default useAuth;
