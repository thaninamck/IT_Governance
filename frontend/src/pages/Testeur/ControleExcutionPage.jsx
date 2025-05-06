import Breadcrumbs from "../../components/Breadcrumbs";
import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import PopUp from "../../components/PopUps/PopUp";
import ConclusionRemediationSection from "../subPages/ConclusionRemediationSection";
import DescriptionTestScriptSection from "../subPages/DescriptionTestScriptSection";
import EvidencesSection from "../subPages/EvidencesSection";
import MultiSelectButtons from "../../components/ToggleButtons";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { SquarePen } from "lucide-react";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SendIcon from "@mui/icons-material/Send";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import emailjs from "emailjs-com";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PermissionRoleContext } from "../../Context/permissionRoleContext";
import useExecution from "../../Hooks/useExecution";
import DecisionPopUp from "../../components/PopUps/DecisionPopUp";
import VisibilityIcon from "@mui/icons-material/Visibility"; // ou RateReviewIcon

import { useAuth } from "../../Context/AuthContext";
import { api } from "../../Api";
import useRemediation from "../../Hooks/useRemediation";

import CommentButton from "../../components/ExecutionPage/CommentButton";
import ExistingComment from "../../components/ExecutionPage/ExistingComment";
import { toast } from "react-toastify";

// Initialize EmailJS with your userID
// emailjs.init("oAXuwpg74dQwm0C_s"); // Replace 'YOUR_USER_ID' with your actual userID

function ControleExcutionPage() {
  const location = useLocation();
  const controleData = location.state?.controleData || {};
  console.log("controoooole data", controleData);
  // Accédez à userRole et setUserRole via le contexte
  const { userRole, setUserRole } = useContext(PermissionRoleContext);
  const {
    loading,
    getExecutionById,
    getFileURL,
    deleteEvidence,
    uploadEvidences,
    updateExecution,
    createComment,
    deleteComment,
    editComment,
  } = useExecution();


  const {
    action,
    error,
    showRemediation,
    setShowRemediation,
    fetchRemediations,
    handleAdd,
    handleEditRow,
    handleDeleteRow,
    confirmDeleteRemediation,
    handleCloseRow,
    handleSendAction,
    showDecisionPopup,
    setShowDecisionPopup,
    handleDecisionResponse,
    isDeletePopupOpen,
    setIsDeletePopupOpen,
    selectedActionId,
    setSelectedActionId,
    isAddingAnother,
    handleCloseForm,

  } = useRemediation(controleData.executionId, controleData.controlCode);

  useEffect(() => {
    fetchRemediations();
  }, []);


  const navigate = useNavigate();
  const { mission, name, controlCode } = useParams();


  console.log(controleData);
  const { user } = useAuth();
  const handleRowClick = (rowData) => {
    navigate(`/missions/${mission}/${name}/${controlCode}/remediation/${rowData.actionName}`, {
      state: { remediationData: rowData },
    });
  };
  const [testScriptData, setTestScriptData] = useState([]);
  const [localSelections, setLocalSelections] = useState({}); // Renommé ici
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [deletedEvidence, setDeletedEvidence] = useState(null);
  const [deletedTestFile, setDeletedTestFile] = useState(null);
  const [activePanel, setActivePanel] = useState("evidence");
  const [multiSelectStatus, setMultiSelectStatus] = useState({});
  const [executionData, setExecutionData] = useState(null);
  const [evidences, setEvidences] = useState([]);
  const [steps, setSteps] = useState([]);
  const [isToReview, setIsToReview] = useState(false);
  const [isToValidate, setIsToValidate] = useState(false);
  const sourceNames = controleData.sources.map(s => s.source_name).join(', ');
  const [isEditing, setIsEditing] = useState(true);
  const [selectedMulti, setSelectedMulti] = useState(controleData.statusId);

  const statusOptions = ["Terminé", "en cours", "Non commencée"];
  const statusColors = {
    Terminé: "green",
    En_cours: "orange",
    Non_Commencée: "gray",
  };
  // const [isAddingAnother, setIsAddingAnother] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [testFiles, setTestFiles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [description, setDescription] = useState(controleData.controlDescription || "");
  const [testScript, setTestScript] = useState(controleData.testScript || "");
  const [type, setType] = useState(controleData.typeName || "");
  const [controlOwner, setControlOwner] = useState(controleData.executionControlOwner || "");
  const [majorProcess, setMajorProcess] = useState(controleData.majorProcess || "");
  const [subProcess, setSubProcess] = useState(controleData.subProcess || "");
  const [controleID, setControleID] = useState(controleData.controlCode || "");
  const [selections, setSelections] = useState({
    
  });
  const [files, setFiles] = useState([]);
  const options = [
    { label: "Applied", value: "Applied" },
    { label: "Partially Applied", value: "Partially Applied" },
    { label: "Not Applied", value: "Not Applied" },
    { label: "Not Tested", value: "Not Tested" },
    { label: "Not Applicable", value: "Not Applicable" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const missionId = controleData.missionId;
      const data = await getExecutionById(missionId, controleData.executionId);

      if (data && Array.isArray(data)) {
        const parsedData = data.map((item) => ({
          ...item,
          steps: JSON.parse(item.steps),
          evidences: JSON.parse(item.evidences),
        }));

        setExecutionData(parsedData);
        console.log("executionData", executionData)
      }
    };

    if (controleData.executionId) {
      fetchData();
    }

  }, [controleData.executionId, controleData.missionId]);
  //const [evidences, setEvidences] = useState([]);
  //const [steps, setSteps] = useState([]);
  //const [isToReview, setIsToReview] = useState(false);
  //const [isToValidate, setIsToValidate] = useState(false);
  const [commentaire, setCommentaire] = useState("");
  //const sourceNames = controleData.sources.map((s) => s.source_name).join(", ");
  // const [selections, setSelections] = useState({
  //   IPE: true,
  //   Design: false,
  //   Effectiveness: true,
  // });
  const [existingComments, setExistingComments] = useState([
    // {
    //   y: 150,
    //   initials: "NK",
    //   name: "Nina Koliai",
    //   text: "Premier commentaire.",
    // },
    // {
    //   y: 300,
    //   initials: "AB",
    //   name: "Alex Ben",
    //   text: "Deuxième commentaire."
    // },
  ]);
  useEffect(() => {
    console.log("Execution Data:", executionData);

    console.log("ipeee gizan:", executionData?.[0]?.ipe);

    const allEvidences = executionData?.[0]?.evidences || [];
    const filteredEvidences = allEvidences.filter(
      (file) => file.is_f_test === false
    );
    const filteredTestFiles = allEvidences.filter(
      (file) => file.is_f_test === true
    );
    setCommentaire(executionData?.[0]?.comment);
    setSelections({
      IPE: executionData?.[0]?.ipe,
      Design: executionData?.[0]?.design,
      Effectiveness: executionData?.[0]?.effectiveness,
    });
    //setExistingComments(executionData?.[0]?.remarks)
    if (executionData?.[0]?.remarks) {
      try {
        const parsedRemarks = JSON.parse(executionData[0].remarks);
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
    setSteps(executionData?.[0]?.steps || []);
    setIsToReview(executionData?.[0]?.execution_is_to_review);
    setIsToValidate(executionData?.[0]?.execution_is_to_validate);
  }, [executionData]);


  //const [isEditing, setIsEditing] = useState(true);
  // const statusOptions = ["Terminé", "En_cours", "Non_commencee"];
  // const statusColors = {
  //   Terminé: "green",
  //   En_cours: "orange",
  //   Non_Commencée: "gray",
  // };
  //const [selectedMulti, setSelectedMulti] = useState(controleData.statusId);

  // const [showRemediation, setShowRemediation] = useState(false);
  // const [showPopup, setShowPopup] = useState(false);
  // const [description, setDescription] = useState(
  //   controleData.controlDescription || ""
  // );
  // const [testScript, setTestScript] = useState(controleData.testScript || "");
  // const [type, setType] = useState(controleData.typeName || "");
  // const [controlOwner, setControlOwner] = useState(
  //   controleData.executionControlOwner || ""
  // );
  // const [majorProcess, setMajorProcess] = useState(
  //   controleData.majorProcess || ""
  // );
  // const [subProcess, setSubProcess] = useState(controleData.subProcess || "");
  // const [controleID, setControleID] = useState(controleData.controlCode || "");
  useEffect(() => {
    console.log("icommentssssssss:", existingComments);
  }, [existingComments]); // Log the selectedMulti whenever it changes


  const handleStatesChange = (selections) => {
    console.log("Depuis ControlExecution :", selections);
    setSelections(selections);
  };


  // const updateStatusBasedOnSuivi = () => {
  //   setAction((prevActions) =>
  //     prevActions.map((action) => ({
  //       ...action,
  //       status: action.suivi.trim() !== "" ? "En_cours" : "Non_commencee",
  //     }))
  //   );
  // };

  // useEffect(() => {
  //   updateStatusBasedOnSuivi();
  // }, []);
  useEffect(() => {
    console.log("comments", existingComments);
  }, [existingComments]);

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
    {
      field: "alert",
      headerName: "Alerte",
      width: 300,
      customRenderCell: (params) => {
        const { statusName, suivi } = params.row;
        const isAlert = statusName === "en cours" && (!suivi || suivi.trim() === "");

        return isAlert ? (
          <div style={{ color: "red", fontWeight: "bold", fontSize: "12px" }}>
            Cette remédiation n’a pas encore été traitée
          </div>
        ) : null;
      }
    },

    { field: "statusName", headerName: "Status", width: 180 },
    { field: "actions", headerName: "Action", width: 80 },
  ];


  useEffect(() => {
    if (controleData.executionId) {
      fetchRemediations();
    }

  }, [controleData.executionId]);


  const rowActions = [
    {
      icon: (
        <SendIcon sx={{ marginRight: "5px", width: "20px", height: "20px" }} />
      ),
      label: "Envoyer",
      onClick: (selectedRow) => handleSendAction(selectedRow),
    },
    {
      icon: (
        <DeleteOutlineRoundedIcon
          sx={{ color: "var(--alert-red)", marginRight: "5px" }}
        />
      ),
      label: "cloturé",
      onClick: (selectedRow) => handleCloseRow(selectedRow),
      disabled: (selectedRow) =>
        selectedRow.statusName === "en cours" &&
        (!selectedRow.suivi || selectedRow.suivi.trim() === ""),
    },
    {
      icon: <SquarePen className="mr-2 w-[20px] h-[20px]" />,
      label: "Modifier",
      onClick: (selectedRow) => handleEditRow(selectedRow),
    },
    {
      icon: (
        <DeleteOutlineRoundedIcon
          sx={{ color: "var(--alert-red)", marginRight: "5px" }}
        />
      ),
      label: "Supprimer",
      onClick: (selectedRow) => handleDeleteRow(selectedRow),
    },
  ];

  // const onClose = () => {
  //   setShowDecisionPopup(false);
  // };
  const handleCommentSave = (newComment) => {
    console.log("Nouveau commentaire:", newComment);
    setCommentaire(newComment);
  };
  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setActivePanel(newValue === 0 ? "evidence" : "test");
  };

  const handleSaveFiles = async (formData) => {
    const formDataToSend = new FormData();
    const execution_id = executionData[0].execution_id;
    const is_f_test = activePanel === "test";

    // Ajouter chaque fichier avec ses métadonnées
    let index = 0;
    for (const [key, file] of formData.entries()) {
      formDataToSend.append(`files[${index}]`, file); // Le fichier lui-même
      formDataToSend.append(`files[${index}][execution_id]`, execution_id);
      formDataToSend.append(`files[${index}][is_f_test]`, is_f_test);
      index++;
    }

    // Vérification du contenu de FormData (pour debug)
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await uploadEvidences(formDataToSend);
    console.log("response data", response.data);
    if (response.status === 200) {
      if (activePanel === "evidence") {
        setEvidences((prevFiles) => [...prevFiles, ...response.data]);
      } else if (activePanel === "test") {
        console.log("actual yest files", testFiles);
        console.log("test file", formData);
        setTestFiles((prevFiles) => [...prevFiles, ...response.data]);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    setOpenDeletePopup(false); // Fermer la popup de confirmation
    if (activePanel === "evidence") {
      const response = await deleteEvidence(deletedEvidence.evidence_id);
      if (response === 200) {
        setEvidences((prevFiles) =>
          prevFiles.filter(
            (file) => file.evidence_id !== deletedEvidence.evidence_id
          )
        );
      }
    } else if (activePanel === "test") {
      console.log("ID du test file supprimé :", deletedTestFile.evidence_id);
      const response = await deleteEvidence(deletedTestFile.evidence_id);
      if (response === 200) {
        setTestFiles((prevFiles) =>
          prevFiles.filter(
            (file) => file.evidence_id !== deletedTestFile.evidence_id
          )
        );
      }
    }
  };
  const handleDelete = (index) => {
    if (activePanel === "evidence") {
      setDeletedEvidence(evidences[index]); // Récupérer l’élément à supprimer

      setOpenDeletePopup(true);
      // setEvidences((prevFiles) => prevFiles.filter((_, i) => i !== index));
    } else if (activePanel === "test") {
      setDeletedTestFile(testFiles[index]);
      console.log("ID du test file supprimé :", deletedTestFile.evidence_id);
      setOpenDeletePopup(true);
      // setTestFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }
  };

  // Fonction pour gérer les changements de sélection dans MultiSelectButtons
  const handleSelectionChange = (newSelection) => {
    setLocalSelections(newSelection); // Met à jour l'état des sélections
    // console.log('evd',newSelection)
  };

  const shouldShowRemediation =
    selectedMulti === 6 || selectedMulti === 3;




  const handleValidate = () => {
    // Lorsque vous cliquez sur "Valider", affichez le popup
    console.log("handleValidate called");
    setShowPopup(true);
  };
  const handlePopupClose = () => setShowPopup(false);


  const handleTestScriptChange = (data) => {
    console.log("Test Script Data:", data);
    setTestScriptData(data); // Mettre à jour les données du test script en temps réel
  };

  const handleSaveRevue = async () => {
    if (!controleData?.executionId) {
      console.error("Aucun executionId trouvé.");
      return;
    }

    try {
      const response = await api.patch(`/executions/submit-execution-for-review/${controleData.executionId}`,);
      if (response) {
        alert("Contrôle envoyé pour revue avec succès !");
      } else {
        alert(`Erreur :  "Échec de l'envoi"}`);
      }

    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Une erreur est survenue lors de l'envoi pour revue.");
    }
  };

  const handleSave = async () => {
    console.log('test');
    //   const doc = new jsPDF();
    //   let yOffset = 30; // Position verticale initiale

    //   // Fonction pour vérifier si une nouvelle page est nécessaire
    //   const addNewPageIfNeeded = (offset) => {
    //     if (offset > doc.internal.pageSize.height - 20) {
    //       // 20 est une marge
    //       doc.addPage();
    //       return 30; // Réinitialiser la position verticale
    //     }
    //     return offset;
    //   };

    //   doc.setFontSize(18);
    //   doc.text("Rapport de Contrôle", 105, 20, { align: "center" });
    //   doc.setFontSize(12);
    //   doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    //   // Tableau récapitulatif des informations principales
    //   autoTable(doc, {
    //     startY: yOffset,
    //     head: [["Champ", "Valeur"]],
    //     body: [
    //       ["Type:", type],
    //       ["Major Process:", majorProcess],
    //       ["Sub Process:", subProcess],
    //       ["Description", description],
    //       ["Test Script", testScript],
    //       ["Status", selectedMulti],
    //       ["Commentaire", commentaire],
    //       ["Critères", JSON.stringify(localSelections)],
    //     ],
    //     didDrawPage: (data) => {
    //       yOffset = data.cursor.y + 10; // Mettre à jour la position verticale après le tableau
    //     },
    //   });

    //   // Vérifier si une nouvelle page est nécessaire
    //   yOffset = addNewPageIfNeeded(yOffset);

    //   // Liste des remédiations sous forme de tableau
    //   autoTable(doc, {
    //     startY: yOffset,
    //     head: [
    //       [
    //         "ID",
    //         "Description",
    //         "Contact",
    //         "Date Début",
    //         "Date Fin",
    //         "Suivi",
    //         "Status",
    //       ],
    //     ],
    //     body: action.map((item) => [
    //       item.id,
    //       item.description,
    //       item.contact,
    //       item.dateField,
    //       item.dateField1,
    //       item.suivi,
    //       item.status,
    //     ]),
    //     didDrawPage: (data) => {
    //       yOffset = data.cursor.y + 10; // Mettre à jour la position verticale après le tableau
    //     },
    //   });
    //   // Vérifier si une nouvelle page est nécessaire
    //   yOffset = addNewPageIfNeeded(yOffset);

    //   //    Ajout des données du test script
    //   autoTable(doc, {
    //     startY: yOffset,
    //     head: [["Étape", "Phrase", "Validée", "Commentaire"]],
    //     body: testScriptData.map((item, index) => [
    //       index + 1,
    //       item.phrase,
    //       item.isChecked ? "Oui" : "Non", // Afficher "Oui" ou "Non" pour la validation
    //       item.comment || "Aucun commentaire", // Afficher "Aucun commentaire" si le commentaire est vide
    //     ]),
    //     didDrawPage: (data) => {
    //       yOffset = data.cursor.y + 10; // Mettre à jour la position verticale après le tableau
    //     },
    //   });
    //   // Vérifier si une nouvelle page est nécessaire
    //   yOffset = addNewPageIfNeeded(yOffset);

    //   // Ajout des fichiers de preuves (evidences)
    //   if (evidenceFiles.length > 0) {
    //     doc.text("Fichiers de preuves (Evidences):", 14, yOffset);
    //     yOffset += 10;
    //     evidenceFiles.forEach((file, index) => {
    //       doc.text(`- ${file.name}`, 20, yOffset);
    //       yOffset += 10;
    //       yOffset = addNewPageIfNeeded(yOffset); // Vérifier si une nouvelle page est nécessaire
    //     });
    //   } else {
    //     doc.text("Aucun fichier de preuve (Evidence) disponible.", 14, yOffset);
    //     yOffset += 10;
    //   }

    //   // Vérifier si une nouvelle page est nécessaire
    //   yOffset = addNewPageIfNeeded(yOffset);

    //   // Ajout des fichiers de test
    //   if (testFiles.length > 0) {
    //     doc.text("Fichiers de test:", 14, yOffset);
    //     yOffset += 10;
    //     testFiles.forEach((file, index) => {
    //       doc.text(`- ${file.name}`, 20, yOffset);
    //       yOffset += 10;
    //       yOffset = addNewPageIfNeeded(yOffset); // Vérifier si une nouvelle page est nécessaire
    //     });
    //   } else {
    //     doc.text("Aucun fichier de test disponible.", 14, yOffset);
    //     yOffset += 10;
    //   }
    //   // Créer un fichier ZIP
    //   const zip = new JSZip();

    //   // Générer le PDF
    //   const pdfBlob = doc.output("blob");

    //   // Ajouter le PDF au ZIP
    //   zip.file("rapport_controle.pdf", pdfBlob);

    //   // Ajouter les fichiers de preuves (evidences) au ZIP
    //   for (const file of evidenceFiles) {
    //     if (file instanceof File || file instanceof Blob) {
    //       zip.file(`evidences/${file.name}`, file);
    //     }
    //   }
    //   // Ajouter les fichiers de preuves (evidences) au ZIP
    //   for (const file of testFiles) {
    //     if (file instanceof File || file instanceof Blob) {
    //       zip.file(`testFile/${file.name}`, file);
    //     }
    //   }
    //   // Générer le fichier ZIP et le télécharger
    //   const zipBlob = await zip.generateAsync({ type: "blob" });
    //   saveAs(zipBlob, "rapport_controle.zip");

    //   setShowPopup(true);

    //   console.log(
    //     "Type:",
    //     type,
    //     "Major Process:",
    //     majorProcess,
    //     "Sub Process:",
    //     subProcess,
    //     "Description:",
    //     description,
    //     "TestScript:",
    //     testScript,
    //     "Test Script Data:",
    //     testScriptData,
    //     "Evidence Files:",
    //     evidenceFiles,
    //     "Test Files:",
    //     testFiles,
    //     "status:",
    //     selectedMulti,
    //     "Commentaire:",
    //     commentaire,
    //     "remediation:",
    //     action,
    //     "critere:",
    //     localSelections
    //   );
    //   //setIsEditing(false); // Quitter le mode édition après la sauvegarde
  };

  const handleSubmit = () => {
    const payload = {
      description,
      testScript,
      commentaire,
      status: selectedMulti,
      remediations: action,
    };
    setShowPopup(true);
  };
  const handleSaveModifications = async () => {
    const payload = {
      ipe: selections.IPE,
      design: selections.Design,
      effectiveness: selections.Effectiveness,
      comment: commentaire,
      steps: testScriptData,
      status_id: selectedMulti,
    };
    console.log('payload',payload)
    await updateExecution(controleData.executionId, payload, controleData.missionId);
  };


  // const handleRowClick = (rowData) => {
  //   // Naviguer vers la page de détails avec l'ID du contrôle dans l'URL
  //   navigate(`/remediation/${rowData.id}`, {
  //     state: { remediationData: rowData },
  //   });
  //   // navigate('/controle', { state: { controleData: rowData } });
  //   console.log("Détails du contrôle sélectionné:", rowData);
  // };

  // Check if all remediations are done

  const isAllRemediationDone =
    selectedMulti != "" && action.every((remediation) => remediation?.statusName === "Terminé");

  const controlStatus = isAllRemediationDone
    ? "Terminé"
    : isToReview || isToValidate
      ? "En cours de revue"
      : "En cours";

  const controlIcon =
    controlStatus === "Terminé" ? (
      <CheckCircleIcon
        style={{
          color: "var(--success-green)",
          animation: "fadeIn 1s ease",
          width: "25px",
          height: "25px",
        }}
      />
    ) : controlStatus === "En cours de revue" ? (
      <VisibilityIcon
        style={{
          color: "#3b82f6",
          animation: "fadeIn 1s ease",
          width: "25px",
          height: "25px",
        }}
      />
    ) : (
      <AccessTimeFilledIcon
        style={{
          color: "var(--await-orange)",
          animation: "fadeIn 1s ease",
          width: "20px",
          height: "20px",
        }}
      />
    );

  //*****************************can you check this please i commented it cause i donno if it causes an error ******************
      const isValidateDisabled =
      !selectedMulti || !shouldShowRemediation || !isAllRemediationDone// || !commentaire ;


  //     const handleAddCommentAtPosition = (y) => {
  //       // Vérifier qu'on ne superpose pas un commentaire existant
  //       const isOverlapping = existingComments.some((c) => Math.abs(c.y - y) < 50);
    
  //       if (!isOverlapping) {
  //         setComments([
  //           ...comments,
  //           {
  //             y,
  //             text: "",
  //             tempId: Date.now(),
  //           },
  //         ]);
  //       }
  //     };
  //     const handleSaveComment = async (tempId, text) => {
  //       if (!text.trim()) {
  //         setComments(comments.filter((comment) => comment.tempId !== tempId));
  //         return;
  //       }
    
  //       const user = JSON.parse(window.localStorage.getItem("User"));
  //       const firstName = user.firstName;
  //       const lastName = user.lastName;
  //       const fullName = `${firstName} ${lastName}`;
  //       const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
    
  //       const newExistingComment = {
  //         y: comments.find((c) => c.tempId === tempId).y,
  //         initials: initials,
  //         name: fullName,
  //         text,
  //       };
    
  //       const commentData = {
  //         y: newExistingComment.y,
  //         user_id: user.id,
  //         execution_id: executionData?.[0]?.execution_id,
  //         text: newExistingComment.text,
  //       };
    
  //       const status = await createComment(commentData,controleData.missionId);
  //       if (status >= 200 && status < 300) {
  //         setExistingComments([...existingComments, newExistingComment]);
  //         setComments(comments.filter((comment) => comment.tempId !== tempId));
  //       } else {
  //         toast.error("une erreur est survenue veuillez ressayez");
  //       }
  //     };

      
  // const handleDeleteComment = async (commentId) => {
  //   try {
      
  //     const response = await deleteComment(commentId,controleData.missionId);
  //     if (response === 200) {
  //       setExistingComments((prev) => prev.filter((c) => c.id !== commentId));
  //       toast.success("Commentaire supprimé avec succès !");
  //     }
  //   } catch (error) {
  //     toast.error("Erreur lors de la suppression du commentaire");
  //     console.error(error);
  //   }
  // };

  // const handleEdit = async (updatedComment) => {
  //   console.log("updatedComment", updatedComment);

  //   const status = await editComment(updatedComment.id, updatedComment.text,controleData.missionId);
  //   if (status != 200) {
  //     toast.error("erreur lors de la mise à jour");
  //     return;
  //   }
  //   setExistingComments((prevComments) =>
  //     prevComments.map((c) =>
  //       c.id === updatedComment.id ? { ...c, text: updatedComment.text } : c
  //     )
  //   );
  // };

  // const handleCancelComment = (tempId) => {
  //   // Supprime simplement le commentaire non sauvegardé
  //   setComments(comments.filter((comment) => comment.tempId !== tempId));
  // };
   const [comments, setComments] = useState([]);
  // const currentUserRole = JSON.parse(localStorage.getItem("User"))?.role;

    return (
      
       <div className="relative  ">
      <div
        className="absolute right-0 top-0 w-16 h-full bg-transparent border-l border-none z-40"
        // onClick={(e) => {
        //   if (
        //     e.target === e.currentTarget &&
        //     currentUserRole !== "testeur"
        //   ) {
        //     const rect = e.currentTarget.getBoundingClientRect();
        //     const y = e.clientY - rect.top + e.currentTarget.scrollTop;
        //     handleAddCommentAtPosition(y);
        //   }
        // }}
      >

        {/* Commentaires existants (ne bloquent pas les clics sur la marge) */}
        {!(isToReview || isToValidate) &&
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
                  // onDelete={() => handleDeleteComment(comment.id)}
                  // onEdit={(newText) =>
                  //   handleEdit({ id: comment.id, text: newText })
                  // }
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

     
      {isToReview || isToValidate && (
          <div className=" top-0 left-0 w-full h-full bg-transparent z-50 pointer-events-auto" />
        )}
        <Header user={user} />

      <div className="ml-8 mr-6 pb-9 relative">

        <div className="flex justify-between items-center px-4 py-2">
          {location.pathname.includes("") && <Breadcrumbs />}
        </div>

        <div className="absolute right-4 top-11 flex items-center gap-2 z-10">
          <h1 className="font-medium text-base">Statut : {controlStatus}</h1>
          {controlIcon}
        </div>

        <DescriptionTestScriptSection
          description={description}
          setDescription={setDescription}
          testScript={steps}
          setTestScript={setTestScript}
          isEditing={isEditing}
          handleSave={handleSave}
          type={type}
          majorProcess={majorProcess}
          subProcess={subProcess}
          controlOwner={controlOwner}
          sources={sourceNames}
          onTestScriptChange={handleTestScriptChange} // Transmettre la fonction de rappel
        />
        {openDeletePopup && (
          <DecisionPopUp
            //loading={loading}
            handleDeny={() => setOpenDeletePopup(false)}
            handleConfirm={handleDeleteConfirm}
            text="Confirmation de suppression"
            name="Êtes-vous sûr de vouloir supprimer ce fichier ?"
          />
        )}

        <EvidencesSection
          handleSelectionChange={handleSelectionChange}
          files={files}
          handleSaveFiles={handleSaveFiles}
          handleDelete={handleDelete}
          evidenceFiles={evidences}
          testFiles={testFiles}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          handleTabChange={handleTabChange}
          selections={selections}
          onStatesChange={handleStatesChange}
          getFile={getFileURL}
        />


        <ConclusionRemediationSection
          selectedMulti={selectedMulti}
          setSelectedMulti={setSelectedMulti}
          shouldShowRemediation={
            selectedMulti === 6 ||
            selectedMulti === 3
          }
          commentaire={commentaire}
          setCommentaire={setCommentaire}
          action={action}
          // handleSubmit={handleSave}
          handleSubmit={handleSaveRevue}
          handleAdd={handleAdd}
          handleValidate={handleValidate}
          statusOptions={statusOptions}
          statusColors={statusColors}
          columnsConfig={columnsConfig}
          isValidateDisabled={isValidateDisabled}
          showRemediation={showRemediation}
          setShowRemediation={setShowRemediation}
          handleRowClick={handleRowClick}
          rowActions={rowActions}
          isDeletePopupOpen={isDeletePopupOpen}
          confirmDeleteMission={confirmDeleteRemediation}
          setIsDeletePopupOpen={setIsDeletePopupOpen}
          selectedActionId={selectedActionId}
          handleDecisionResponse={handleDecisionResponse}
          showDecisionPopup={showDecisionPopup}
          isAddingAnother={isAddingAnother}
          controleID={controleID}
          // onClose={handleCloseForm}
          handleCloseForm={handleCloseForm}
          handleSaveModifications={handleSaveModifications}
          loading={loading}
          isToReview={isToReview}
          isToValidate={isToValidate}
        />

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
            <PopUp
              text={"Contrôle envoyé au superviseur avec succès"}
              redirectionURL={handlePopupClose}
            />
          </div>
        )}
      </div>

      </div>
    
      );
}

      export default ControleExcutionPage;
