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
import ExistingComment from '../../components/ExecutionPage/ExistingComment';
import CommentButton from '../../components/ExecutionPage/CommentButton';

function ReviewExecution() {
  
  const [executionData, setExecutionData] = useState(null);
  const location = useLocation();
  const controleData = location.state?.controleData || {};
  console.log('controle data',controleData)
  const {
    loading,
    getExecutionById,
    getFileURL,
    submitExecutionForValidation,
  submitExecutionForCorrection,
  submitExecutionForFinalValidation,
  submitExecutionForReview,
  createComment,
  deleteComment,
  editComment,
  } = useExecution();

  
  const params = useParams();
const missionRevue = params.missionRevue;
const controlCode = params.controlCode;
const navigate = useNavigate();
const { user } = useAuth();

useEffect(() => {
  let executionId = controleData?.executionId;
  let missionId = controleData?.missionId;

  async function fetchData() {
    if ((!executionId || !missionId) && missionRevue && controlCode) {
      console.log('Remplacement par missionRevue et controlCode');
      executionId = controlCode;
      missionId = missionRevue;
    }

    if (!executionId || !missionId) {
      console.log('ExecutionId ou MissionId manquant');
      return;
    }

    const data = await getExecutionById(missionId, executionId);
    console.log('Data execution from revue', data);

    if (data && Array.isArray(data)) {
      const item = data[0]; 
      const parsedData = {
        ...item,
        steps: JSON.parse(item.steps),
        evidences: JSON.parse(item.evidences),
        remarks: JSON.parse(item.remarks),
        remediations: JSON.parse(item.remediations),
        sources: JSON.parse(item.sources),
      };
      setExecutionData(parsedData);
      console.log('parsedData execution',executionData)
    }
  };

  if (executionId || (missionRevue && controlCode)) {
    fetchData();
  }
}, [missionRevue, controlCode]);
console.log("Execution Data:", executionData);

const {
  action,
  error,
  fetchRemediations,
} = useRemediation(executionData?.execution_id);
  const [existingComments, setExistingComments] = useState([])
  const [evidences, setEvidences] = useState([]);
  const [testFiles, setTestFiles] = useState([]);
  const [steps, setSteps] = useState([]);
  const [isToReview, setIsToReview] = useState(false);
  const [isToValidate, setIsToValidate] = useState(false);
  const [selectedMulti, setSelectedMulti] = useState();
  const sourceNames = executionData?.sources?.map((source) => source.source_name).join(", ") || "";

  const [commentaire, setCommentaire] = useState("");
  const [activePanel, setActivePanel] = useState(0);
  const [selections, setSelections] = useState({
    IPE: false,
    Design: false,
    Effectiveness: false,
  });

  useEffect(() => {
    if (executionData) {
      console.log('executionData in useEffect:', executionData);
      console.log('Mise à jour selections:', {
        IPE: executionData.ipe,
        Design: executionData.design,
        Effectiveness: executionData.effectiveness,
      });
      setSelections({
        IPE: executionData.ipe,
        Design: executionData.design,
        Effectiveness: executionData.effectiveness,
      });
      setCommentaire(executionData?.comment || "");
      setSelectedMulti(executionData.status_name|| "");
    }
  }, [executionData]);
  
  
  useEffect(() => {
    console.log('selections updated:', selections);
  }, [selections]);
  
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
        

 
  // Process evidences and steps once execution data is available
  useEffect(() => {
    // if (executionData?.[0]) {
    //   const allEvidences = executionData[0].evidences || [];
    //   setEvidences(allEvidences.filter(file => !file.is_f_test));
    //   setTestFiles(allEvidences.filter(file => file.is_f_test));
    //   setSteps(executionData[0].steps || []);
    //   setIsToReview(executionData[0].execution_is_to_review);
    //   setIsToValidate(executionData[0].execution_is_to_validate);
    //   setCommentaire(executionData[0].comment)
    // }
    console.log("Execution Data:", executionData);

    const allEvidences = executionData?.evidences || [];
    const filteredEvidences = allEvidences.filter(
      (file) => file.is_f_test === false
    );
    const filteredTestFiles = allEvidences.filter(
      (file) => file.is_f_test === true
    );
    setSelections({
      IPE: executionData?.ipe,
      Design: executionData?.design,
      Effectiveness: executionData?.effectiveness,
    });
    setCommentaire(executionData?.comment || "");
    //setExistingComments(executionData?.[0]?.remarks)
    if (executionData?.remarks) {
      try {
        const parsedRemarks = (executionData?.remarks);
        const formattedRemarks = parsedRemarks.map((remark) => {
          const [firstName, lastName] = remark.name?.split(" ") ?? ["", ""];
          return {
            id: remark.id,
            y: Number(remark.y),
            initials:
              remark.initials ||
              `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase(),
            name: remark.name,
            text: remark.text,
            userId: remark.user_id,
          };
        });
        setExistingComments(formattedRemarks);
      } catch (error) {
        console.error("Erreur de parsing des remarques:", error);
        setExistingComments([]);
      }
    } else {
      setExistingComments([]);
    }

    setEvidences(filteredEvidences);
    setTestFiles(filteredTestFiles);
    setSteps(executionData?.steps || []);
    setIsToReview(executionData?.execution_is_to_review);
    setIsToValidate(executionData?.execution_is_to_validate);
 
  }, [executionData]);
 
  useEffect(() => {
    console.log("remarksss gizan",existingComments);
}, [existingComments]);
  useEffect(() => {
         fetchRemediations();
     }, []);

     const { mission } = useParams([]); // Récupérer les paramètres de l'URL
     const { name } = useParams([]);
     const handleRowClick = (rowData) => {
      
      navigate(`/revue/revueExecution/${controlCode}/remediation/${rowData.actionName}`, {
        state: { remediationData: rowData },
      });
    };


    const handleValidateRevue = async () => {
      if (!controleData?.executionId) return alert("Aucun executionId trouvé.");
      try {
        if(controleData.connectedUserProfile === "superviseur"){
        await submitExecutionForValidation(controleData?.missionId,controleData.executionId);
        }else if (controleData.connectedUserProfile === "manager"){
          await submitExecutionForFinalValidation(controleData.executionId);
        }
        
      } catch (err) {
        console.error(err);
       
      }
    };
    
    const handleCorrectRevue = async () => {
      if (!controleData?.executionId) return alert("Aucun executionId trouvé.");
      try {
        if(controleData.connectedUserProfile === "superviseur"){
        await submitExecutionForCorrection(controleData.missionId,controleData.systemId,controleData.executionId);
        }
      else if (controleData.connectedUserProfile === "manager"){
        await submitExecutionForReview(controleData.missionId,controleData.executionId);
      }
      } catch (err) {
        console.error(err);
       
      }
    };
  const handleTabChange = (event, newValue) => {
    setActivePanel(newValue);
  };
  const handleAddCommentAtPosition = (y) => {
    // Vérifier qu'on ne superpose pas un commentaire existant
    const isOverlapping = existingComments.some((c) => Math.abs(c.y - y) < 50);

    if (!isOverlapping) {
      setComments([
        ...comments,
        {
          y,
          text: "",
          tempId: Date.now(),
        },
      ]);
    }
  };
  const handleSaveComment = async (tempId, text) => {
    if (!text.trim()) {
      setComments(comments.filter((comment) => comment.tempId !== tempId));
      return;
    }

    const user = JSON.parse(window.localStorage.getItem("User"));
    const firstName = user.firstName;
    const lastName = user.lastName;
    const fullName = `${firstName} ${lastName}`;
    const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

    const newExistingComment = {
      y: comments.find((c) => c.tempId === tempId).y,
      initials: initials,
      name: fullName,
      text,
    };

    const commentData = {
      y: newExistingComment.y,
      user_id: user.id,
      execution_id: executionData?.execution_id,
      text: newExistingComment.text,
    };
console.log('comment data',commentData)
    const status = await createComment(commentData,controleData.missionId);
    if (status >= 200 && status < 300) {
      setExistingComments([...existingComments, newExistingComment]);
      setComments(comments.filter((comment) => comment.tempId !== tempId));
    } else {
      toast.error("une erreur est survenue veuillez ressayez");
    }
  };

  
const handleDeleteComment = async (commentId) => {
try {
  
  const response = await deleteComment(commentId,controleData.missionId);
  if (response === 200) {
    setExistingComments((prev) => prev.filter((c) => c.id !== commentId));
    toast.success("Commentaire supprimé avec succès !");
  }
} catch (error) {
  toast.error("Erreur lors de la suppression du commentaire");
  console.error(error);
}
};

const handleEdit = async (updatedComment) => {
console.log("updatedComment", updatedComment);

const status = await editComment(updatedComment.id, updatedComment.text,controleData.missionId);
if (status != 200) {
  toast.error("erreur lors de la mise à jour");
  return;
}
setExistingComments((prevComments) =>
  prevComments.map((c) =>
    c.id === updatedComment.id ? { ...c, text: updatedComment.text } : c
  )
);
};

const handleCancelComment = (tempId) => {
// Supprime simplement le commentaire non sauvegardé
setComments(comments.filter((comment) => comment.tempId !== tempId));
};
const [comments, setComments] = useState([]);
const currentUserRole = JSON.parse(localStorage.getItem("User"))?.role;

  return (
    <div className="relative min-h-screen">
<div
        className="absolute right-0 top-0 w-16 h-full bg-transparent border-l border-none z-40"
        onClick={(e) => {
          
            e.target === e.currentTarget 
         
            const rect = e.currentTarget.getBoundingClientRect();
            const y = e.clientY - rect.top + e.currentTarget.scrollTop;
            handleAddCommentAtPosition(y);
         
        }}
      >

        {/* Commentaires existants (ne bloquent pas les clics sur la marge) */}
        {/* {!(isToReview || isToValidate)*/true && 
          existingComments.map((comment, index) => (
            <div
              key={`existing-${index}`}
              className="absolute border-none right-4"
              style={{ top: comment.y }}
            >
              <div className="border-none" onClick={(e) => e.stopPropagation()}>

                <ExistingComment
                  user={{
                    id: comment.userId,
                    initials: comment.initials,
                    name: comment.name,
                  }}
                  comment={comment.text}
                  onDelete={() => handleDeleteComment(comment.id)}
                  onEdit={(newText) =>
                    handleEdit({ id: comment.id, text: newText })
                  }
                />
              </div>
            </div>
          ))}

        {/* Commentaires en cours d'édition à mettre dans la page de revue  */}
        {comments.map((comment) => (
          <div
            key={`temp-${comment.tempId}`}
            className="absolute right-4"
            style={{ top: comment.y }}
            onClick={(e) => e.stopPropagation()} // Bloque le clic parent
          >
            <CommentButton
              onSave={(text) => handleSaveComment(comment.tempId, text)}
              onCancel={() => handleCancelComment(comment.tempId)}
            />
          </div>
        ))}
      </div>
      <Header user={user} />
      <div className="ml-8 mr-6 pb-9 relative">
        {location.pathname.includes("") && <Breadcrumbs />}
        
        <DescriptionTestScriptSection
          description={executionData?.execution_description || ""}
          testScript={steps}
          sources={sourceNames}
          setTestScript={() => {}}
          type={executionData?.type_name || ""}
          majorProcess={executionData?.major_process || ""}
          subProcess={executionData?.sub_process|| ""}
          controlOwner={executionData?.execution_control_owner || ""}
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
          <div className="flex flex-col gap-4 ml-9 mt-4">
    {/* Status */}
    <div className="flex items-center gap-4">
      <label className="text-gray-700 font-medium w-32">Status :</label>
      <div className="w-[18%] border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
  style={{
    boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.1)", // effet ombre en bas
  }}>
        {selectedMulti}
      </div>
    </div>

    {/* Commentaire */}
    <div className="flex items-start gap-4">
      <label className="text-gray-700 font-medium w-32">Commentaire :</label>
      <div
  className="w-[80%] min-h-[80px] border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
  style={{
    boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.1)", // effet ombre en bas
  }}
>
  {commentaire}
</div>



    </div>
  </div>
        </div>

        <div>
          <Separator text={"Remédiation"} />
          {
            action.length > 0 ? (
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

            ):(
              <p className="text-gray-500 text-m pl-9">Aucune remédiation pour ce contrôle </p>
            )
          }
          

          <div className="flex justify-end mt-8">
  <button
    className="bg-[var(--alert-red)] mr-16 text-white px-4 py-2 border-none shadow-bottom"
    onClick={handleCorrectRevue}
  >
    Ajuster
  </button>

  <button
    className="bg-[var(--success-green)] mr-16 text-white px-4 py-2 border-none shadow-bottom"
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
