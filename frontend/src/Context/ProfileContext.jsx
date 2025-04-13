import { createContext, useState, useContext } from "react";

// Créer le contexte
const ProfileContext = createContext();

// Créer un provider pour gérer l'état du profile
export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const storedProfile = localStorage.getItem("userProfile");
    return storedProfile ? JSON.parse(storedProfile) : null;
  });

  const updateProfile = (newProfile) => {
    setProfile(newProfile); // Mettre à jour le profil
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
  };

  console.log('profilecontext',profile)

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Hook personnalisé pour accéder au profil
export const useProfile = () => {
  return useContext(ProfileContext);
};
