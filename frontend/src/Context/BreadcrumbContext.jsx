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

  useEffect(() => {
    // Mettre à jour les breadcrumbs en fonction de l'URL
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    const updatedBreadcrumbs = pathSegments.map((segment, index) => ({
        label: customLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1), // Utilise le mapping ou une version capitalisée
        path: '/' + pathSegments.slice(0, index + 1).join('/'),
      }));
    setBreadcrumbs(updatedBreadcrumbs);
  }, [location]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => useContext(BreadcrumbContext);
