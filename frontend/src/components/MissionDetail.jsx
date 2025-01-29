import { useParams } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import ToggleButtons from './ToggleButtons';
import HeaderWithAction from './Header/HeaderWithAction';

function MissionDetail() {
    const { mission} = useParams(); // Récupérer les paramètres de l'URL
    const handleAddUser = () => {
        console.log("Ajouter un utilisateur");
      }; 

    return (
        <div style={{width:'80%',margin:"4%"}}>
            
            <h1>Détails de la Mission</h1>
            <p><strong>Mission :</strong> {mission}</p>
            <ToggleButtons/>

            <HeaderWithAction
        title="Utilisateurs"
        buttonLabel="Ajouter un utilisateur"
        onButtonClick={handleAddUser}
      />
          
        </div>
    );
}

export default MissionDetail;
