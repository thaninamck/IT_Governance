import React, { createContext, useState } from "react";

// Créez un contexte pour userRole
export const PermissionRoleContext = createContext();

// Créez un composant Provider pour encapsuler votre application
export const PermissionRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("admin"); // Valeur par défaut

  return (
    <PermissionRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </PermissionRoleContext.Provider>
  );
};