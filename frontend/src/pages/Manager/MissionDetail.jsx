import { useLocation, useParams } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import ToggleButtons from '../../components/ToggleButtons';
import Header from '../../components/Header/Header';
import MissionInfo from '../../components/InfosDisplay/MissionInfo';
import Separator from '../../components/Decorators/Separator';
import AddScope from '../../components/InfosDisplay/AddScope';
import { useState } from 'react';

function MissionDetail() {
    const { mission} = useParams(); // Récupérer les paramètres de l'URL
    const location = useLocation(); // Obtenir l'URL actuelle 
    const [showForm, setShowForm] = useState(false);

    const handleToggleForm = () => {
      setShowForm((prev) => !prev); // Change l'état pour afficher ou masquer le formulaire
    };

    
       // Liste des chemins où les breadcrumbs doivent s'afficher
  const breadcrumbRoutes = [ "/tablemission",
    "/missionInfo",
    "/statusmission",
    "/table",
    "/tableApp"];

    return (
        <div className=" ">
          <Header/>
          <div className=' ml-5 mr-6 pb-9'>
            {/* Afficher Breadcrumbs uniquement si le chemin correspond */}
      {breadcrumbRoutes.some((route) => location.pathname.startsWith(route)) && (
        <Breadcrumbs />
      )}
      <MissionInfo mission={mission}/>
      <AddScope title={'Scope Application'} text={'Aucune application ajoutée pour le moment'} text1={"Ajouter d'autre application "} onToggleForm={handleToggleForm} // Passe la fonction en prop
          showForm={showForm} />
           <AddScope title={'Matrice'} text={'Aucune application ajoutée pour le moment'} onToggleForm={handleToggleForm} // Passe la fonction en prop
          showForm={showForm} />
      
     
          


           
      </div>
          
        </div>
    );
}

export default MissionDetail;
