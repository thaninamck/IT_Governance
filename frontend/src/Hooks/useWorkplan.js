import { useState, useEffect } from "react";
import { api } from "../Api"; // Instance Axios
import { useAuth } from "../Context/AuthContext"; // Contexte d'authentification
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const useWorkplan = () => {
  const {id}=useParams();
  console.log('id',id)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saveloading, setSaveLoading] = useState(false);

  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [controls, setControls] = useState([]);
  const [risks, setRisks] = useState([]);
  const [testers, setTesters] = useState([]);
  const [executions, setExecutions] = useState([]);
  const fetchOptions = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/missions/${id}/workplanOptions`);
      const data = response.data;

      setApplications(data.applications);
      setRisks(data.risks);
      setControls(data.controls);

    } catch (err) {
      setError(err);
      //toast.error("Erreur lors de la récupération des options du plan de travail.");
    } finally {
      setLoading(false);
    }
  };


  const fetchTesters = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/missions/${id}/testers`);
      const data = response.data;
      setTesters(data);
     console.log("testers",data);

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };


  const createExecutions = async (executionsData) => {
    setSaveLoading(true);
    try {
      // Formater les données comme requis par l'API
      //const formattedData = { executions: executionsData };

      const response = await api.post(`/missions/${id}/insert-executions`, executionsData);
      setExecutions(response.data); 
      toast.success("Controles ajoutées avec succès.");
    } catch (err) {
      setError(err);
      console.error("Erreur lors de l'envoi des exécutions:", err);
    } finally {
      setSaveLoading(false);
    }
  };
  useEffect(() => {
    //const missionId = 1; 
    fetchOptions(id);
    fetchTesters(id);
  }, []); 

  const deleteExecutions = async (executionsIds) => {
    
    try {
      // Formater les données comme requis par l'API
      //const formattedData = { executions: executionsData };

      const response = await api.post(`/executions/deleteExecutions`, executionsIds);
       if(response.status===400){
        return response.data;
        toast.error("certains controles ne peuvent as etre supprimés ils sont en cours d'execution .");
       }
       toast.success("Controles supprimées avec succès.");
     return []
    } catch (err) {
      setError(err);
      console.error("Erreur lors de la suppression des exécutions:", err);
    } 
  };
  
  return {
    loading,
    error,
    applications,
    risks,
    saveloading,
    controls,
    testers,
    createExecutions,
    deleteExecutions,
  };
};

export default useWorkplan;
// // Données imbriquées
//   const data1 = {
//     applications: [
//       {
//         id: "app1",
//         description: "USSD",
//         layers: [
//           {
//             id: "l1",
//             name: "OS",
//             risks: [
//               {
//                 id: "1",
//                 nom: "SDLC requirements are not exist or are not conducted.",
//                 description:
//                   "furfuzirfyzuf iuzyfoz ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof",
//                 owner: "",
//                 controls: [
//                   {
//                     id: "4",
//                     description:
//                       "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification...",
//                     majorProcess: "Technical",
//                     subProcess: "Access control",
//                     testScript:
//                       "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
//                     owner: "",
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             id: "l2",
//             name: "APP",
//             risks: [],
//           },
//         ],
//         owner: "",
//       },
//     ],
//   };



// // Données initiales
//   const rows = [
//     {
//       id: 1,
//       application: "USSD",
//       applicationLayer: "OS",
//       applicationOwner: "rezazi",
//       riskCode: "FTRM",
//       riskName: "SEC log",
//       riskDescription: "Security log risk",
//       riskOwner: "John Doe",
//       controlCode: "PCS214",
//       controlDescription: "Supportability",
//       majorProcess: "Technical",
//       subProcess: "Access control",
//       testScript: "Verify logs",
//       controlOwner: "Jane Smith",
//       controlTester: 1, // ID du testeur
//     },
//     {
//       id: 2,
//       application: "USSD",
//       applicationLayer: "APP",
//       applicationOwner: "rezazi",
//       riskCode: "FTRM",
//       riskName: "SEC log",
//       riskDescription: "Security log risk",
//       riskOwner: "John Doe",
//       controlCode: "PCS215",
//       controlDescription: "Audit Logs",
//       majorProcess: "Technical",
//       subProcess: "Access control",
//       testScript: "Check audit logs",
//       controlOwner: "Jane Smith",
//       controlTester: 2, // ID du testeur
//     },
//   ];