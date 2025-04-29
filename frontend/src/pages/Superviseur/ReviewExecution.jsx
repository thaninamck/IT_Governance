import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../Context/AuthContext';
import Breadcrumbs from '../../components/Breadcrumbs';
import Header from '../../components/Header/Header';
import ToggleButton from "../../components/ToggleButtons";
import DescriptionTestScriptSection from '../subPages/DescriptionTestScriptSection';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useExecution from '../../Hooks/useExecution';
import useRemediation from '../../Hooks/useRemediation';
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Separator from '../../components/Decorators/Separator';
import EvidenceList from '../../components/Evidences/EvidenceList';
import Table from '../../components/Table';
import { api } from '../../Api';

function ReviewExecution() {
  const location = useLocation();
  const controleData = location.state?.controleData || {};
  console.log('controle data',controleData)
  const {
    loading,
    getExecutionById,
    getFileURL,
  } = useExecution();

  const {
    action,
    error,
    fetchRemediations,
  } = useRemediation(controleData.executionId, controleData.controlCode);

  const [executionData, setExecutionData] = useState(null);
  const [evidences, setEvidences] = useState([]);
  const [testFiles, setTestFiles] = useState([]);
  const [steps, setSteps] = useState([]);
  const [isToReview, setIsToReview] = useState(false);
  const [isToValidate, setIsToValidate] = useState(false);
  const [selectedMulti, setSelectedMulti] = useState(controleData.executionStatus);
  const sourceNames = controleData.sources
  const [commentaire, setCommentaire] = useState(controleData.commentaire || "");
  const [activePanel, setActivePanel] = useState(0);
  const [selections, setSelections] = useState({
        IPE: controleData.executionIpe,
        Design: controleData.executionDesign,
        Effectiveness: controleData.executionEffectiveness,
      });
      const columnsConfig = [
            { field: "actionName", headerName: "Nom", width: 250, editable: true },
            {
              field: "description",
              headerName: "Description",
              editable: true,
              width: 300,
            },
            { field: "ownerContact", headerName: "Contact", width: 250 },
            { field: "startDate", headerName: "Date début", width: 200 },
            { field: "endDate", headerName: "Date Fin", width: 200 },
            {
              field: "suivi",
              headerName: "Suivi",
              editable: true,
              width: 300,
            },
            { field: "statusName", headerName: "Status", width: 180 },
        
          ];
        

  const navigate = useNavigate();
  const { user } = useAuth();


  // Fetch execution data
  useEffect(() => {
    const fetchData = async () => {
      const data = await getExecutionById(controleData.executionId);
      if (data && Array.isArray(data)) {
        const parsedData = data.map((item) => ({
          ...item,
          steps: JSON.parse(item.steps),
          evidences: JSON.parse(item.evidences),
        }));
        setExecutionData(parsedData);
      }
    };
    if (controleData.executionId) {
      fetchData();
    }
  }, [controleData.executionId]);

  // Process evidences and steps once execution data is available
  useEffect(() => {
    if (executionData?.[0]) {
      const allEvidences = executionData[0].evidences || [];
      setEvidences(allEvidences.filter(file => !file.is_f_test));
      setTestFiles(allEvidences.filter(file => file.is_f_test));
      setSteps(executionData[0].steps || []);
      setIsToReview(executionData[0].execution_is_to_review);
      setIsToValidate(executionData[0].execution_is_to_validate);
    }
  }, [executionData]);
  console.log("Execution Data:", executionData);

  useEffect(() => {
         fetchRemediations();
     }, []);

     const { mission } = useParams([]); // Récupérer les paramètres de l'URL
     const { name } = useParams([]);
     const { controlCode } = useParams([]);
     const handleRowClick = (rowData) => {
      
      navigate(`/revue/revueExecution/${controlCode}/remediation/${rowData.actionName}`, {
        state: { remediationData: rowData },
      });
    };

  const handleValidateRevue = async () => {
    if (!controleData?.executionId) {
      console.error("Aucun executionId trouvé.");
      return;
    }

    try {
      const response = await api.patch(`/executions/submit-execution-for-validate/${controleData.executionId}`);
      if (response) {
        alert("Contrôle envoyé pour revue avec succès !");
      } else {
        alert(`Erreur : "Échec de l'envoi"`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Une erreur est survenue lors de l'envoi pour revue.");
    }
  };

  const handleCorrectRevue = async () => {
    if (!controleData?.executionId) {
      console.error("Aucun executionId trouvé.");
      return;
    }

    try {
      const response = await api.patch(`/executions/submit-execution-for-correction/${controleData.executionId}`);
      if (response) {
        alert("Contrôle envoyé pour revue avec succès !");
      } else {
        alert(`Erreur : "Échec de l'envoi"`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Une erreur est survenue lors de l'envoi pour revue.");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActivePanel(newValue);
  };

  return (
    <div className="relative min-h-screen">

      <Header user={user} />
      <div className="ml-8 mr-6 pb-9 relative">
        {location.pathname.includes("") && <Breadcrumbs />}
        
        <DescriptionTestScriptSection
          description={controleData.executionModification || ""}
          testScript={steps}
          sources={sourceNames}
          setTestScript={() => {}}
          type={controleData.typeName || ""}
          majorProcess={controleData.majorProcess || ""}
          subProcess={controleData.subProcess || ""}
          controlOwner={controleData.executionControlOwner || ""}
          readOnly={true}
        />

        <div className="max-h-screen min-h-screen">
          <div className="flex flex-col gap-14">
            <div className="mr-6 ml-6">
              <Separator text={"Evidences"} />
            </div>
            <div className="flex justify-center mt-4">
              <ToggleButton selections={selections} readOnly={true} />
            </div>

            <div className="w-full flex-1 p-5 relative mt-3 mb-3 ml-5 pr-14">
              <Tabs value={activePanel} onChange={handleTabChange}>
                <TabList className="w-full border-b">
                  <Tab value={0}>Evidences</Tab>
                  <Tab value={1}>Fiches de test</Tab>
                </TabList>

                <TabPanel value={0}>
                  <div style={{ overflow: "auto", maxHeight: "800px" }}>
                    <EvidenceList files={evidences} getFile={getFileURL} readOnly={true}/>
                    {evidences.length === 0 && <p className="text-center text-gray-500 mt-4">Aucun evidence disponible.</p>}
                  </div>
                </TabPanel>

                <TabPanel value={1}>
                  <div style={{ overflow: "auto", maxHeight: "800px" }}>
                    <EvidenceList files={testFiles} getFile={getFileURL} readOnly={true} />
                    {testFiles.length === 0 && <p className="text-center text-gray-500 mt-4">Aucune fiche de test disponible.</p>}
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>

        <div>
          <Separator text={"Conclusion"} />
          <div className="flex items-center gap-14 py-7 ml-9">
            <label className="font-medium">Status</label>
            <p>{selectedMulti}</p>
          </div>
          <p className="mt-4 font-medium ml-16">Commentaire: {commentaire}</p>
        </div>

        <div>
          <Separator text={"Remédiation"} />
          <div className="flex-1 mr-10 overflow-x-auto overflow-y-auto h-[400px] transition-all">
          <Table
            key={JSON.stringify(action)}
            columnsConfig={columnsConfig}
            rowsData={action}
            onRowClick={handleRowClick}
            headerTextBackground={"white"}
            headerBackground="var(--blue-menu)"
          />
          </div>

          <div className="flex justify-end mt-5">
          <button
              className="bg-[var(--alert-red)] mr-16 text-white px-4 py-2 border-none"
              onClick={handleCorrectRevue}
            >
              Ajuster
            </button>

            <button
              className="bg-[var(--success-green)] mr-16 text-white px-4 py-2 border-none"
              onClick={handleValidateRevue}
            >
              valider
            </button>
           
          </div>
        </div>

      </div>
    </div>
  );
}

export default ReviewExecution;
