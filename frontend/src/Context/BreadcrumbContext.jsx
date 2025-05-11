import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BreadcrumbContext = createContext();

export const BreadcrumbProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const location = useLocation();

  // Mapping des noms d'URL vers des labels plus lisibles
  const customLabels = {
    'tablemission': 'Mes Missions ',
    
  };

  // useEffect(() => {
  //   // Mettre à jour les breadcrumbs en fonction de l'URL
  //   const pathSegments = location.pathname.split('/').filter(Boolean);
    
  //   const updatedBreadcrumbs = pathSegments.map((segment, index) => ({
  //       label: customLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1), // Utilise le mapping ou une version capitalisée
  //       path: '/' + pathSegments.slice(0, index + 1).join('/'),
  //       state: { Id: Id }
  //     }));
  //   setBreadcrumbs(updatedBreadcrumbs);
  // }, [location]);

  // Mettre à jour les breadcrumbs uniquement si pas déjà définis manuellement
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
  
    const updatedBreadcrumbs = pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      return {
        label: customLabels[segment] || decodeURIComponent(segment),
        path,
        state: location.state || {}, // Facultatif
      };
    });
  
    setBreadcrumbs(updatedBreadcrumbs);
  }, [location]);
  

  // Fonction pour ajouter dynamiquement un breadcrumb avec state
  const addBreadcrumb = (label, path, state = {}) => {
    setBreadcrumbs(prev => {
      // Vérifie si le breadcrumb existe déjà
      const existingIndex = prev.findIndex(b => b.path === path);
      
      if (existingIndex >= 0) {
        // Met à jour le breadcrumb existant
        return prev.map((b, i) => 
          i === existingIndex ? { ...b, state: { ...b.state, ...state } } : b
        );
      }
      
      // Ajoute un nouveau breadcrumb
      return [...prev, { label, path, state }];
    });
  };

  

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs, addBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => useContext(BreadcrumbContext);
