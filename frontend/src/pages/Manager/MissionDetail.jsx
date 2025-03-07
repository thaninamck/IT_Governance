import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Header from "../../components/Header/Header";
import MissionInfo from "../../components/InfosDisplay/MissionInfo";
import AddScope from "../../components/InfosDisplay/AddScope";
import { useContext, useState } from "react";
import { PermissionRoleContext } from "../../Context/permissionRoleContext";
import AddMatrix from "../../components/InfosDisplay/AddMatrix";

function MissionDetail() {
  const { mission } = useParams(); // Récupérer les paramètres de l'URL
  const location = useLocation(); // Obtenir l'URL actuelle
  const [showForm, setShowForm] = useState(false);
  console.log("Mission sélectionnée :", mission); // Vérifie l'ID récupéré

  const { userRole, setUserRole } = useContext(PermissionRoleContext);


  const handleToggleForm = () => {
    setShowForm((prev) => !prev); // Change l'état pour afficher ou masquer le formulaire
  };

  const missionData = location.state?.missionData; // Récupérer les données envoyées

  // Liste des chemins où les breadcrumbs doivent s'afficher
  const breadcrumbRoutes = [
    "/missions",
    "/tablemission",
    "/missionInfo",
    "/statusmission",
    "/table",
    "/tableApp",
    "/rapportmission", // Ajout pour la page principale
    "/rapportmission/:missionName", // Ajout pour une mission spécifique
  ];



  return (
    <div className=" ">
      <Header />
      <div className=" ml-5 mr-6 pb-9">
        {/* Afficher Breadcrumbs uniquement si le chemin correspond */}
        {breadcrumbRoutes.some((route) =>
          location.pathname.startsWith(route)
        ) && <Breadcrumbs />}
        <MissionInfo dataFormat={missionData} userRole={userRole} />
        <AddScope
          title={"Scope Application"}
          text={"Aucune application ajoutée pour le moment"}
          text1={"Ajouter d'autre application "}
          onToggleForm={handleToggleForm} // Passe la fonction en prop
          showForm={showForm}
          userRole={userRole}
          missionId={mission}
        />
        <AddMatrix userRole={userRole} />
      </div>
    </div>
  );
}

export default MissionDetail;
