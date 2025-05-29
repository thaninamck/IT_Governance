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
import { Switch, FormControlLabel } from "@mui/material";

// Initialize EmailJS with your userID
// emailjs.init("oAXuwpg74dQwm0C_s"); // Replace 'YOUR_USER_ID' with your actual userID

function ControleExcutionPage() {
  const location = useLocation();
  const controleData = location.state?.controleData || {};
  console.log("controoooole data", controleData);
  const {
    executionStatus,
    setExecutionStatus,
    loading,
    getExecutionById,
    getFileURL,
    deleteEvidence,
    uploadEvidences,
    updateExecution,
    createComment,
    deleteComment,
    editComment,
    options,
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
  } = useRemediation(controleData.missionId,controleData.systemId,controleData.executionId, controleData.controlCode);

  useEffect(() => {
    fetchRemediations();
  }, []);

  const navigate = useNavigate();
  const { mission, name, controlCode } = useParams();

  console.log(controleData);
  const { user } = useAuth();
  const handleRowClick = (rowData) => {
    navigate(
      `/missions/${mission}/${name}/${controlCode}/remediation/${rowData.actionName}`,
      {
        state: { remediationData: rowData },
      }
    );
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
  const sourceNames = controleData.sources.map((s) => s.source_name).join(", ");
  const [isEditing, setIsEditing] = useState(true);
  const [selectedMulti, setSelectedMulti] = useState();
  const [deletingFileIndex, setDeletingFileIndex] = useState(null);

  const statuses = options.map((status) => ({
    label: status.status_name,
    value: status.id,
  }));
  const selectedStatusLabel = statuses.find(
    (status) => status.value === selectedMulti
  )?.label;

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
  const [description, setDescription] = useState(
    controleData.controlDescription || ""
  );
  const [testScript, setTestScript] = useState(controleData.testScript || "");
  const [type, setType] = useState(controleData.typeName || "");
  const [controlOwner, setControlOwner] = useState(
    controleData.executionControlOwner || ""
  );
  const [majorProcess, setMajorProcess] = useState(
    controleData.majorProcess || ""
  );
  const [subProcess, setSubProcess] = useState(controleData.subProcess || "");
  const [controleID, setControleID] = useState(controleData.controlCode || "");
  const [selections, setSelections] = useState({});
  const [files, setFiles] = useState([]);
  const Options = [
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
         
          remediations: JSON.parse(item.remediations),
        }));

        setExecutionData(parsedData);
        console.log("executionData", executionData);
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
    setSelectedMulti(executionData?.[0]?.status_id);
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
        const isAlert =
          statusName === "en cours" && (!suivi || suivi.trim() === "");

        return isAlert ? (
          <div style={{ color: "red", fontWeight: "bold", fontSize: "12px" }}>
            Cette remédiation n’a pas encore été traitée
          </div>
        ) : null;
      },
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

  // const handleSaveFiles = async (formData) => {
  //   const formDataToSend = new FormData();
  //   const execution_id = executionData[0].execution_id;
  //   const is_f_test = activePanel === "test";

  //   // Ajouter chaque fichier avec ses métadonnées
  //   let index = 0;
  //   for (const [key, file] of formData.entries()) {
  //     formDataToSend.append(`files[${index}]`, file); // Le fichier lui-même
  //     formDataToSend.append(`files[${index}][execution_id]`, execution_id);
  //     formDataToSend.append(`files[${index}][is_f_test]`, is_f_test);
  //     index++;
  //   }

  //   // Vérification du contenu de FormData (pour debug)
  //   for (let pair of formDataToSend.entries()) {
  //     console.log(pair[0], pair[1]);
  //   }

  //   const response = await uploadEvidences(controleData.missionId,formDataToSend);
  //   console.log("response data", response.data);
  //   if (response.status === 200) {
  //     if (activePanel === "evidence") {
  //       setEvidences((prevFiles) => [...prevFiles, ...response.data]);
  //     } else if (activePanel === "test") {
  //       console.log("actual yest files", testFiles);
  //       console.log("test file", formData);
  //       setTestFiles((prevFiles) => [...prevFiles, ...response.data]);
  //     }
  //   }
  // };

  const handleSaveFiles = async (formData) => {
    // Configuration des limites
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB en bytes
    const MAX_TOTAL_SIZE = 200 * 1024 * 1024; // 200MB en bytes
    const MAX_FILE_COUNT = 10;

    // Vérification du nombre de fichiers
    if (formData.getAll("files").length > MAX_FILE_COUNT) {
      toast.info(
        `Vous ne pouvez uploader que ${MAX_FILE_COUNT} fichiers maximum.`
      );
      return;
    }

    // Vérification de la taille des fichiers et du total
    let totalSize = 0;
    const files = formData.getAll("files");

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`Le fichier ${file.name} dépasse la taille maximale de 50MB.`);
        return;
      }
      totalSize += file.size;
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      toast.info(
        `La taille totale des fichiers (${(totalSize / (1024 * 1024)).toFixed(
          2
        )}MB) dépasse la limite de 200MB.`
      );
      return;
    }

    // Si tout est OK, procéder à l'envoi
    const formDataToSend = new FormData();
    const execution_id = executionData[0].execution_id;
    const is_f_test = activePanel === "test";

    // Ajouter chaque fichier avec ses métadonnées
    let index = 0;
    for (const [key, file] of formData.entries()) {
      formDataToSend.append(`files[${index}]`, file);
      formDataToSend.append(`files[${index}][execution_id]`, execution_id);
      formDataToSend.append(`files[${index}][is_f_test]`, is_f_test);
      index++;
    }

    // Vérification du contenu de FormData (pour debug)
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await uploadEvidences(
        controleData.missionId,
        formDataToSend
      );
      //console.log("response data", response.data);
      if (response.status === 200) {
        if (activePanel === "evidence") {
          setEvidences((prevFiles) => [...prevFiles, ...response.data]);
        } else if (activePanel === "test") {
          console.log("actual test files", testFiles);
          console.log("test file", formData);
          setTestFiles((prevFiles) => [...prevFiles, ...response.data]);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast.error("Une erreur est survenue lors de l'envoi des fichiers.");
    }
  };
  const handleDeleteConfirm = async () => {
    setOpenDeletePopup(false); // Fermer la popup de confirmation
    if (activePanel === "evidence") {
      const response = await deleteEvidence(
        controleData.missionId,
        deletedEvidence.evidence_id
      );
      if (response >= 200) {
        setEvidences((prevFiles) =>
          prevFiles.filter(
            (file) => file.evidence_id !== deletedEvidence.evidence_id
          )
        );
        setDeletedEvidence(null); // Réinitialiser l'élément supprimé
        toast.success("Evidences supprimés avec succees");
      }
    } else if (activePanel === "test") {
      const response = await deleteEvidence(
        controleData.missionId,
        deletedTestFile.evidence_id
      );
      if (response === 200) {
        setTestFiles((prevFiles) =>
          prevFiles.filter(
            (file) => file.evidence_id !== deletedTestFile.evidence_id
          )
        );
      }
      setDeletedTestFile(null); // Réinitialiser l'élément supprimé
      toast.success("Fichier de test supprimé avec succès !");
    }
  };
  const handleDelete = (index) => {
    if (activePanel === "evidence") {
      setDeletedEvidence(evidences[index]); // Récupérer l’élément à supprimer

      setOpenDeletePopup(true);
      // setEvidences((prevFiles) => prevFiles.filter((_, i) => i !== index));
    } else if (activePanel === "test") {
      setDeletedTestFile(testFiles[index]);
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
    executionStatus === "partially applied" ||
    executionStatus === "not applied";

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
      const response = await api.patch(
        `missions/${controleData?.missionId}/executions/submit-execution-for-review/${controleData?.executionId}`
      );
      if (response) {
        toast.success("Contrôle envoyé pour revue avec succès !");
      } else {
        toast.error(`Erreur :  "Échec de l'envoi"}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      toast.error("Une erreur est survenue lors de l'envoi pour revue.");
    }
  };

  const handleSave = async () => {
    console.log("test");
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
    console.log("payload", payload);
    await updateExecution(
      controleData.executionId,
      payload,
      controleData.missionId
    );
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
    selectedMulti != null &&
    action.every((remediation) => remediation?.statusName === "Terminé");
  console.log("isAllRemediation", isAllRemediationDone);

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

  const isValidateDisabled =  !executionStatus || !isAllRemediationDone ||!selectedMulti;
  // !selectedMulti || !isAllRemediationDone;
  // (!shouldShowRemediation && !isAllRemediationDone);
  // || !commentaire ;

  console.log('executionstatus',executionStatus)
  console.log('isvalidatedisable',isValidateDisabled)
  const [comments, setComments] = useState([]);
  // const currentUserRole = JSON.parse(localStorage.getItem("User"))?.role;

  const [overlayEnabled, setOverlayEnabled] = useState(true); // toggle admin

  const shouldShowOverlay = (isToReview || isToValidate) && overlayEnabled;

  return (
    <div className="  ">
      <Header user={user} />
      <div className="flex flex-row w-full justify-between">
        <div className=" w-[96%]">
          {user?.role === "admin" && (isToReview || isToValidate) && (
            <div className=" mx-12 mt-6">
              <FormControlLabel
                control={
                  <Switch
                    checked={overlayEnabled}
                    onChange={(e) => setOverlayEnabled(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  overlayEnabled
                    ? "Activer la modification"
                    : "Désactiver la modification"
                }
              />
            </div>
          )}

          <div className="ml-8 mr-6 pb-9 relative">
            <div className="flex flex-col  sm:flex-col">
              {/* Header avec breadcrumbs */}
              <div className="flex   flex-col sm:flex-row justify-between items-start sm:items-center px-4   ">
                {location.pathname.includes("") && <Breadcrumbs />}
              </div>

              {/* Statut, positionné proprement */}
              <div className="relative mb-10 ">
                <div className=" flex items-center gap-2    sm:absolute sm:right-4 sm:top-3 z-10 rounded-md">
                  <h1 className="font-medium text-sm sm:text-base ">
                    Statut : {controlStatus}
                  </h1>
                  {controlIcon}
                </div>
              </div>
            </div>

            {shouldShowOverlay && (
              <div className="fixed top-30 left-0  w-full h-full bg-transparent z-50 pointer-events-auto " />
            )}

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
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <DecisionPopUp
                  handleDeny={() => {
                    setOpenDeletePopup(false);
                    setDeletedEvidence(null);
                    setDeletedTestFile(null);
                  }}
                  handleConfirm={handleDeleteConfirm}
                  text="Confirmation de suppression"
                  name="Êtes-vous sûr de vouloir supprimer ce fichier ?"
                />
              </div>
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
              deletingId={
                deletedEvidence?.evidence_id 
              }
              deletingTestId={
                deletedTestFile?.evidence_id 
              }
            />

            <ConclusionRemediationSection
              selectedMulti={selectedMulti}
              setSelectedMulti={setSelectedMulti}
              shouldShowRemediation={
                executionStatus === "partially applied" ||
                executionStatus === "not applied"
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
              status={executionData?.[0]?.status_name}
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
        <div
          className=/*absolute right-0 top-0*/ " w-[4%]  bg-transparent z-40   "
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
                className="absolute border-none  right-3"
                style={{ top: comment.y }}
              >
                <div
                  className="border-none "
                  onClick={(e) => e.stopPropagation()}
                >
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
              className="absolute right-4 "
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
      </div>
    </div>
  );
}

export default ControleExcutionPage;
