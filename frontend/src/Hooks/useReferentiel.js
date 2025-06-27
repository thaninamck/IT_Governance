import { useState, useEffect } from "react";
import { api } from "../Api"; // Instance Axios
import { useAuth } from "../Context/AuthContext"; // Contexte d'authentification
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useReferentiel = () => {
  const navigate = useNavigate(); // Hook pour la navigation

  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [risksData, setRisksData] = useState([]); // Ajout du state
  const [controlsData, setControlsData] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [majorOptions, setMajorOptions] = useState([]);
  const [subOptions, setSubOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const fetchRisks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/risks"); // Récupération des risques
      setRisksData(response.data); // Stockage des risques dans le state
      console.log(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des risques.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
    fetchControls();
    fetchSelectOptions();
  }, []);

  const updateRisk = async (riskId, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/update-risk/${riskId}`, updatedData);
      toast.success("Risque mis à jour avec succès !");
      setRisksData((prevRisks) =>
        prevRisks.map((risk) =>
          risk.id === riskId ? { ...risk, ...response.data } : risk
        )
      );
      return response.data;
    } catch (error) {
      setError("Erreur lors de la mise à jour du risque.");
      toast.error("Échec de la mise à jour !");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRisk = async (riskId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.delete(`/delete-risk/${riskId}`);
      if (response.status == 200) {
        toast.success("Risque supprimé avec succès !");
        setRisksData((prevRisks) =>
          prevRisks.filter((risk) => risk.id !== riskId)
        );
      }
    } catch (error) {
      setError("Erreur lors de la suppression du risque.");
      toast.error("Ce risque ne peut pas tre supprimé !");
      console.error(error);
      return null; // Pour éviter un retour `undefined`
    } finally {
      setLoading(false);
    }
  };

  const createRisk = async (riskData) => {
    console.log("risque a jouter", riskData);
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/create-risk", riskData);
      toast.success("Risque ajouté avec succès !");
      setRisksData((prevRisks) => [...prevRisks, response.data]);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 422) {
        toast.error("Ce risque existe déjà !");

        throw new Error("Ce risque existe déjà !");
      }
      setError("Erreur lors de l'ajout du risque.");
      toast.error("Échec de l'ajout du risque !");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const normalize = (str) => (str ? str.trim().toLowerCase() : "");

  const createMultipleRisks = async (risksArray) => {
    setLoading(true);
    setError(null);

    // Supprimer la première ligne (en-tête)
    const filteredRisks = risksArray.slice(1);

    // Normaliser les risques existants
    const normalizedRisksData = risksData.map((risk) => ({
      code: normalize(risk.code),
      name: normalize(risk.nomRisque),
      description: normalize(risk.description),
    }));

    // Filtrer les risques à insérer en détectant ceux qui ont au moins un champ différent
    const uniqueRisks = filteredRisks.filter((newRisk) => {
      const normalizedNewRisk = {
        code: normalize(newRisk.code),
        name: normalize(newRisk.name),
        description: normalize(newRisk.description),
      };

      // Vérifier si un risque avec le même code existe mais avec des valeurs différentes
      return !normalizedRisksData.some(
        (existingRisk) =>
          existingRisk.code === normalizedNewRisk.code &&
          existingRisk.name === normalizedNewRisk.name &&
          existingRisk.description === normalizedNewRisk.description
      );
    });

    console.log("RisksData:", risksData);
    console.log("Risks to insert:", uniqueRisks);

    if (uniqueRisks.length === 0) {
      toast.info("Aucun nouveau risque à ajouter.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/create-multiple-risks", uniqueRisks);
      toast.success("Risques ajoutés avec succès !");
      console.log(response.data);
      setRisksData((prevRisks) => [...prevRisks, ...response.data]);
      return response.data;
    } catch (error) {
      setError("Erreur lors de l'ajout des risques.");
      toast.error("Échec de l'ajout des risques !");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMultipleRisks = async (riskIds) => {
    if (!Array.isArray(riskIds) || riskIds.length === 0) {
      toast.error("Aucun risque sélectionné !");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/risks/multiple-delete", {
        ids: riskIds,
      });

      if (response.status === 200) {
        toast.success("Risques supprimés avec succès !");
        setRisksData((prevRisks) =>
          prevRisks.filter((risk) => !riskIds.includes(risk.id))
        );
      }
    } catch (error) {
      setError("Erreur lors de la suppression des risques.");
      toast.error("Échec de la suppression des risques !");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchControls = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/controls");
      setControlsData(response.data);
      console.log("controlsssssssssssssssssssssssssss data ",response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des contrôles.");
    } finally {
      setLoading(false);
    }
  };

  const updateControl = async (controlId, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      // Effectuer la requête PATCH
      const response = await api.patch(`/update-control/${controlId}`, updatedData);

      // Vérifier si la réponse est réussie (si status est 2xx)
      if (response.status >= 200 && response.status < 300) {
        // Si la réponse est ok, mettre à jour l'état et afficher le toast
        setControlsData((prev) =>
          prev.map((ctrl) =>
            ctrl.id === controlId ? { ...ctrl, ...updatedData } : ctrl
          )
        );
        toast.success("Contrôle mis à jour avec succès !");
      } else {
        // Si le code status n'est pas 2xx, on considère comme une erreur
        setError("Erreur lors de la mise à jour du contrôle.");
        toast.error("Échec de la mise à jour du contrôle : certaines étapes sont liées à des exécutions en cours.");
      }
    } catch (error) {
      setError("Erreur lors de la mise à jour du contrôle.");
      toast.error("Échec de la mise à jour du contrôle !");
    } finally {
      setLoading(false);
    }
};


  const createControl = async (controlData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/insert-control", controlData);
      toast.success("Contrôle ajouté avec succès !");
      console.log(response.data)
      setControlsData((prev) => [...prev, { ...response.data }]);
    } catch (error) {
      setError("Erreur lors de l'ajout du contrôle.");
      toast.error("Échec de l'ajout du contrôle !");
    } finally {
      setLoading(false);
    }
  };

  const createMultipleControls = async (controlsArray) => {
    setLoading(true);
    setError(null);
    console.log("controlsArray",controlsArray);
    try {
      const response = await api.post("/insert-controls", {controls:controlsArray});
      toast.success("Contrôles ajoutés avec succès !");
      setControlsData((prev) => [...prev, ...response.data]);
    } catch (error) {
      setError("Erreur lors de l'ajout des contrôles.");
      toast.error("Échec de l'ajout des contrôles !");
    } finally {
      setLoading(false);
    }
  };

  const archiveControl = async (controlId) => {
    setLoading(true);
    setError(null);
    try {
      await api.patch(`/archive-control/${controlId}`);
      toast.success("Contrôle archivé avec succès !");
      setControlsData((prev) => prev.filter((ctrl) => ctrl.id !== controlId));
    } catch (error) {
      setError("Erreur lors de l'archivage du contrôle.");
      toast.error("Échec de l'archivage du contrôle !");
    } finally {
      setLoading(false);
    }
  };

  const restoreControl = async (controlId) => {
    setLoading(true);
    setError(null);
    try {
      await api.patch(`/restore-control/${controlId}`);
      toast.success("Contrôle restauré avec succès !");
      fetchControls();
    } catch (error) {
      setError("Erreur lors de la restauration du contrôle.");
      toast.error("Échec de la restauration du contrôle !");
    } finally {
      setLoading(false);
    }
  };
 
  const fetchSelectOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/select-options");
      console.log("select options",response.data);
      setTypeOptions(response.data.types);
      setMajorOptions(response.data.majorProcesses);
      setSubOptions(response.data.subProcesses);
      setSourceOptions(response.data.sources);
    } catch (error) {
      setError("Erreur lors de la récupération des options.");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteControl = async (cntrlId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.delete(`/delete-control/${cntrlId}`);
      if (response.status == 200) {
        toast.success("controle supprimé avec succès !");
        setControlsData((prevControls) =>
          prevControls.filter((control) => control.id !== cntrlId)
        );
      }
    } catch (error) {
      setError("Erreur lors de la suppression du controle.");
      toast.error("Ce controle ne peut pas tre supprimé !");
      console.error(error);
      return null; // Pour éviter un retour `undefined`
    } finally {
      setLoading(false);
    }
  };

 
 
 
  const deleteMultipleControls = async (controlIds) => {
    if (!Array.isArray(controlIds) || controlIds.length === 0) {
      toast.error("Aucun contrôle sélectionné !");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await api.post("/controls/multiple-delete", {
        ids: controlIds,
      });
  
      if (response.status === 200 && Array.isArray(response.data)) {
        const deletedIds = response.data; // IDs des contrôles supprimés retournés par l'API
  
        toast.success("Contrôles supprimés avec succès !");
        setControlsData((prevControls) =>
          prevControls.filter((control) => !deletedIds.includes(control.id))
        );
      }
    } catch (error) {
      setError("Erreur lors de la suppression des contrôles.");
      toast.error("Échec de la suppression des contrôles !");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  
  return {
    risksData,
    loading,
    error,
    updateRisk,
    deleteRisk,
    deleteControl,
    createRisk,
    deleteMultipleRisks,
    createMultipleRisks,
    setRisksData,
    controlsData,
    deleteMultipleControls, 

    updateControl,
    createControl,
    createMultipleControls,
    archiveControl,
    restoreControl,
    setControlsData,
    typeOptions,
    majorOptions,
    subOptions,
    sourceOptions,
  };
};

export default useReferentiel;

/*
    
      const risksData = [
    {
      id: 1,
      code: "RIS.3001",
      nomRisque: "Accès non autorisé",
      description:
        "Risque d'accès illégal aux systèmes sensibles sans authentification appropriée.",
    },
    {
      id: 2,
      code: "RIS.3002",
      nomRisque: "Panne système",
      description:
        "Défaillance des systèmes critiques en raison d'une mauvaise gestion des mises à jour.",
    },
    {
      id: 3,
      code: "RIS.3003",
      nomRisque: "Fuite de données",
      description:
        "Divulgation involontaire d'informations sensibles suite à une mauvaise configuration des permissions.",
    },
    {
      id: 4,
      code: "RIS.3004",
      nomRisque: "Intrusion réseau",
      description:
        "Attaque externe visant à compromettre la sécurité du réseau interne.",
    },
    {
      id: 5,
      code: "RIS.3005",
      nomRisque: "Non-conformité",
      description:
        "Non-respect des réglementations en matière de protection des données.",
    },
  ];
    
    */
