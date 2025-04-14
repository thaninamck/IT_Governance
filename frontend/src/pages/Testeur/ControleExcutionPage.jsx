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
import { useLocation, useNavigate } from "react-router-dom";
import { PermissionRoleContext } from "../../Context/permissionRoleContext";
import useExecution from "../../Hooks/useExecution";
import DecisionPopUp from "../../components/PopUps/DecisionPopUp";
import VisibilityIcon from "@mui/icons-material/Visibility"; // ou RateReviewIcon
// Initialize EmailJS with your userID
emailjs.init("oAXuwpg74dQwm0C_s"); // Replace 'YOUR_USER_ID' with your actual userID

function ControleExcutionPage() {
  // Accédez à userRole et setUserRole via le contexte
  const { userRole, setUserRole } = useContext(PermissionRoleContext);
  const {
    loading,
    getExecutionById,
    getFileURL,
    deleteEvidence,
    uploadEvidences,
    updateExecution,
  } = useExecution();

  const location = useLocation();
  const controleData = location.state?.controleData || {};
  console.log(controleData);

  const [executionData, setExecutionData] = useState(null);

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
  const [evidences, setEvidences] = useState([]);
  const [steps, setSteps] = useState([]);
  const [isToReview, setIsToReview] = useState(false);
  const [isToValidate, setIsToValidate] = useState(false);
  const sourceNames = controleData.sources.map(s => s.source_name).join(', ');

  useEffect(() => {
    console.log("Execution Data:", executionData);
    const allEvidences = executionData?.[0]?.evidences || [];
    const filteredEvidences = allEvidences.filter(
      (file) => file.is_f_test === false
    );
    const filteredTestFiles = allEvidences.filter(
      (file) => file.is_f_test === true
    );

    setEvidences(filteredEvidences);
    setTestFiles(filteredTestFiles);
    setSteps(executionData?.[0]?.steps || []);
    setIsToReview(executionData?.[0]?.execution_is_to_review);
    setIsToValidate(executionData?.[0]?.execution_is_to_validate);
  }, [executionData]);
  const [commentaire, setCommentaire] = useState(
    controleData.commentaire || ""
  );
  const [isEditing, setIsEditing] = useState(true);
  const statusOptions = ["Terminé", "En_cours", "Non_commencee"];
  const statusColors = {
    Terminé: "green",
    En_cours: "orange",
    Non_Commencée: "gray",
  };
  const [selectedMulti, setSelectedMulti] = useState(controleData.statusId);

  useEffect(() => {
    console.log("Selected Multi:", selectedMulti);
  }, [selectedMulti]); // Log the selectedMulti whenever it changes

  const [showRemediation, setShowRemediation] = useState(false);
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
  const [selections, setSelections] = useState({
    IPE: controleData.ipe,
    Design: controleData.design,
    Effectiveness: controleData.effectiveness,
  });

  const handleStatesChange = (selections) => {
    console.log("Depuis ControlExecution :", selections);
    setSelections(selections);
  };

  const updateStatusBasedOnSuivi = () => {
    setAction((prevActions) =>
      prevActions.map((action) => ({
        ...action,
        status: action.suivi.trim() !== "" ? "En_cours" : "Non_commencee",
      }))
    );
  };

  useEffect(() => {
    updateStatusBasedOnSuivi();
  }, []);

  const columnsConfig = [
    { field: "id", headerName: "ID", width: 250, editable: true },
    {
      field: "description",
      headerName: "Description",
      editable: true,
      width: 300,
    },
    { field: "contact", headerName: "Contact", width: 250 },
    { field: "dateField", headerName: "Date début", width: 200 },
    { field: "dateField1", headerName: "Date Fin", width: 200 },
    {
      field: "suivi",
      headerName: "Suivi",
      editable: true,
      width: 300,
    },
    { field: "status", headerName: "Status", width: 180 },
    { field: "actions", headerName: "Action", width: 80 },
  ];

  const [files, setFiles] = useState([
    // { name: 'document.pdf', size: 1024000 },
    // { name: 'image.png', size: 2048000 },
    // { name: 'presentation.pptx', size: 512000 }
  ]);

  // Options et couleurs de statut utilisateur
  const options = [
    { label: "Applied", value: "Applied" },
    { label: "Partially Applied", value: "Partially Applied" },
    { label: "Not Applied", value: "Not Applied" },
    { label: "Not Tested", value: "Not Tested" },
    { label: "Not Applicable", value: "Not Applicable" },
  ];
  const [action, setAction] = useState([
    {
      id: 1,
      description: "llllll",
      contact: "km_mohandouali@esi.dz",
      dateField: "2025-02-01",
      dateField1: "2025-02-06",
      suivi: "",
      status: "Terminé",
    },
    {
      id: 2,
      description: "llllll",
      contact: "manelmohandouali@gmail.com",
      dateField: "2025-02-05",
      dateField1: "2025-02-10",
      suivi: "lll",
      status: "En_cours",
    },
    {
      id: 3,
      description: "llllll",
      contact: "manel.mohandouali@mazars.dz",
      dateField: "2025-01-11",
      dateField1: "2025-01-21",
      suivi: "mll",
      status: "Non_commencee",
    },
    {
      id: 4,
      description: "llllll",
      contact: "farid@gmail.com",
      dateField: "2025-02-05",
      dateField1: "2025-02-10",
      suivi: "lll",
      status: "En_cours",
    },
    {
      id: 5,
      description: "llllll",
      contact: "farid@gmail.com",
      dateField: "2025-01-11",
      dateField1: "2025-01-21",
      suivi: "mll",
      status: "Non_commencee",
    },
  ]);

  const [selectedActionId, setSelectedActionId] = useState("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isAddingAnother, setIsAddingAnother] = useState(false);
  // États pour stocker les fichiers séparément
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [testFiles, setTestFiles] = useState([]);

  const handleDeleteRow = (selectedRow) => {
    setSelectedActionId(selectedRow.id);
    console.log(selectedActionId);
    setIsDeletePopupOpen(true);
  };
  const confirmDeleteMission = () => {
    if (selectedActionId !== null) {
      setAction((prev) => prev.filter((row) => row.id !== selectedActionId));
    }
    setIsDeletePopupOpen(false);
    setSelectedActionId(null);
  };
  const handleEditRow = (selectedRow) => {
    setSelectedActionId(selectedRow);
    if (!showRemediation) setShowRemediation((prev) => !prev);
  };

  const handleDecisionResponse = (response) => {
    setShowDecisionPopup(false);
    if (response) {
      setIsAddingAnother(true);
    } else {
      setIsAddingAnother(false);
      setShowRemediation((prev) => !prev);
    }
  };
  const onClose = () => {
    setShowDecisionPopup(false);
  };
  // Configurez EmailJS avec votre userID
  //emailjs.init('YOUR_USER_ID');

  const handlesendAction = (selectedRow) => {
    if (!selectedRow || !selectedRow.contact) {
      alert("Aucune adresse e-mail trouvée pour cet élément !");
      return;
    }

    const templateParams = {
      to_email: selectedRow.contact,
      description: selectedRow.description,
      dateField: selectedRow.dateField,
      dateField1: selectedRow.dateField1,
    };

    console.log("Envoi de l'email avec les paramètres :", templateParams);

    emailjs
      .send("service_dg6av6d", "template_f4ojiam", templateParams)
      .then((response) => {
        console.log(
          "E-mail envoyé avec succès!",
          response.status,
          response.text
        );
        alert(`E-mail envoyé avec succès à ${selectedRow.contact} !`);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi de l'e-mail:", error);
        alert("Erreur lors de l'envoi de l'e-mail. Veuillez réessayer.");
      });
  };

  const rowActions = [
    {
      icon: (
        <SendIcon sx={{ marginRight: "5px", width: "20px", height: "20px" }} />
      ),
      label: "Envoyer",
      onClick: (selectedRow) => handlesendAction(selectedRow),
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

  const [multiSelectStatus, setMultiSelectStatus] = useState({});

  const handleCommentSave = (newComment) => {
    console.log("Nouveau commentaire:", newComment);
    setCommentaire(newComment);
  };

  // État pour suivre l'onglet actif
  const [activePanel, setActivePanel] = useState("evidence");

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

  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [deletedEvidence, setDeletedEvidence] = useState(null);
  const [deletedTestFile, setDeletedTestFile] = useState(null);
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

  const [localSelections, setLocalSelections] = useState({}); // Renommé ici

  // Fonction pour gérer les changements de sélection dans MultiSelectButtons
  const handleSelectionChange = (newSelection) => {
    setLocalSelections(newSelection); // Met à jour l'état des sélections
    // console.log('evd',newSelection)
  };

  const shouldShowRemediation =
    selectedMulti === "Partially Applied" || selectedMulti === "Not Applied";
  const isValidateDisabled =
    !selectedMulti || !commentaire || shouldShowRemediation;
  const [showDecisionPopup, setShowDecisionPopup] = useState(false);

  const handleAdd = (remediation) => {
    if (selectedActionId) {
      // Mise à jour de l'application existante
      setAction((prevApps) =>
        prevApps.map((row) => (row.id === remediation.id ? remediation : row))
      );
      setSelectedActionId(null);
      setShowRemediation((prev) => !prev);
    } else {
      setAction((prev) => [
        ...prev,
        { id: prev.length + 1, ...remediation }, // Add the remediation to the list
      ]);
      setShowDecisionPopup(true);
    }
  };
  const handleValidate = () => {
    // Lorsque vous cliquez sur "Valider", affichez le popup
    console.log("handleValidate called");
    setShowPopup(true);
  };
  const handlePopupClose = () => setShowPopup(false);

  const [testScriptData, setTestScriptData] = useState([]); // État pour stocker les données du test script
  const handleTestScriptChange = (data) => {
    console.log("Test Script Data:", data);
    setTestScriptData(data); // Mettre à jour les données du test script en temps réel
  };

  const handleSave = async () => {
    const doc = new jsPDF();
    let yOffset = 30; // Position verticale initiale

    // Fonction pour vérifier si une nouvelle page est nécessaire
    const addNewPageIfNeeded = (offset) => {
      if (offset > doc.internal.pageSize.height - 20) {
        // 20 est une marge
        doc.addPage();
        return 30; // Réinitialiser la position verticale
      }
      return offset;
    };

    doc.setFontSize(18);
    doc.text("Rapport de Contrôle", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    // Tableau récapitulatif des informations principales
    autoTable(doc, {
      startY: yOffset,
      head: [["Champ", "Valeur"]],
      body: [
        ["Type:", type],
        ["Major Process:", majorProcess],
        ["Sub Process:", subProcess],
        ["Description", description],
        ["Test Script", testScript],
        ["Status", selectedMulti],
        ["Commentaire", commentaire],
        ["Critères", JSON.stringify(localSelections)],
      ],
      didDrawPage: (data) => {
        yOffset = data.cursor.y + 10; // Mettre à jour la position verticale après le tableau
      },
    });

    // Vérifier si une nouvelle page est nécessaire
    yOffset = addNewPageIfNeeded(yOffset);

    // Liste des remédiations sous forme de tableau
    autoTable(doc, {
      startY: yOffset,
      head: [
        [
          "ID",
          "Description",
          "Contact",
          "Date Début",
          "Date Fin",
          "Suivi",
          "Status",
        ],
      ],
      body: action.map((item) => [
        item.id,
        item.description,
        item.contact,
        item.dateField,
        item.dateField1,
        item.suivi,
        item.status,
      ]),
      didDrawPage: (data) => {
        yOffset = data.cursor.y + 10; // Mettre à jour la position verticale après le tableau
      },
    });
    // Vérifier si une nouvelle page est nécessaire
    yOffset = addNewPageIfNeeded(yOffset);

    //    Ajout des données du test script
    autoTable(doc, {
      startY: yOffset,
      head: [["Étape", "Phrase", "Validée", "Commentaire"]],
      body: testScriptData.map((item, index) => [
        index + 1,
        item.phrase,
        item.isChecked ? "Oui" : "Non", // Afficher "Oui" ou "Non" pour la validation
        item.comment || "Aucun commentaire", // Afficher "Aucun commentaire" si le commentaire est vide
      ]),
      didDrawPage: (data) => {
        yOffset = data.cursor.y + 10; // Mettre à jour la position verticale après le tableau
      },
    });
    // Vérifier si une nouvelle page est nécessaire
    yOffset = addNewPageIfNeeded(yOffset);

    // Ajout des fichiers de preuves (evidences)
    if (evidenceFiles.length > 0) {
      doc.text("Fichiers de preuves (Evidences):", 14, yOffset);
      yOffset += 10;
      evidenceFiles.forEach((file, index) => {
        doc.text(`- ${file.name}`, 20, yOffset);
        yOffset += 10;
        yOffset = addNewPageIfNeeded(yOffset); // Vérifier si une nouvelle page est nécessaire
      });
    } else {
      doc.text("Aucun fichier de preuve (Evidence) disponible.", 14, yOffset);
      yOffset += 10;
    }

    // Vérifier si une nouvelle page est nécessaire
    yOffset = addNewPageIfNeeded(yOffset);

    // Ajout des fichiers de test
    if (testFiles.length > 0) {
      doc.text("Fichiers de test:", 14, yOffset);
      yOffset += 10;
      testFiles.forEach((file, index) => {
        doc.text(`- ${file.name}`, 20, yOffset);
        yOffset += 10;
        yOffset = addNewPageIfNeeded(yOffset); // Vérifier si une nouvelle page est nécessaire
      });
    } else {
      doc.text("Aucun fichier de test disponible.", 14, yOffset);
      yOffset += 10;
    }
    // Créer un fichier ZIP
    const zip = new JSZip();

    // Générer le PDF
    const pdfBlob = doc.output("blob");

    // Ajouter le PDF au ZIP
    zip.file("rapport_controle.pdf", pdfBlob);

    // Ajouter les fichiers de preuves (evidences) au ZIP
    for (const file of evidenceFiles) {
      if (file instanceof File || file instanceof Blob) {
        zip.file(`evidences/${file.name}`, file);
      }
    }
    // Ajouter les fichiers de preuves (evidences) au ZIP
    for (const file of testFiles) {
      if (file instanceof File || file instanceof Blob) {
        zip.file(`testFile/${file.name}`, file);
      }
    }
    // Générer le fichier ZIP et le télécharger
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "rapport_controle.zip");

    setShowPopup(true);

    // // Télécharger automatiquement le PDF
    // doc.save('rapport_controle.pdf');
    // setShowPopup(true);

    console.log(
      "Type:",
      type,
      "Major Process:",
      majorProcess,
      "Sub Process:",
      subProcess,
      "Description:",
      description,
      "TestScript:",
      testScript,
      "Test Script Data:",
      testScriptData,
      "Evidence Files:",
      evidenceFiles,
      "Test Files:",
      testFiles,
      "status:",
      selectedMulti,
      "Commentaire:",
      commentaire,
      "remediation:",
      action,
      "critere:",
      localSelections
    );
    //setIsEditing(false); // Quitter le mode édition après la sauvegarde
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
    await updateExecution(controleData.executionId, payload);
  };
  const navigate = useNavigate();

  const handleRowClick = (rowData) => {
    // Naviguer vers la page de détails avec l'ID du contrôle dans l'URL
    navigate(`/remediation/${rowData.id}`, {
      state: { remediationData: rowData },
    });
    // navigate('/controle', { state: { controleData: rowData } });
    console.log("Détails du contrôle sélectionné:", rowData);
  };
  


  // Check if all remediations are done
  const isAllRemediationDone =
    action.every((remediation) => remediation.status === "Terminé") &&
    selectedMulti != "";

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

  return (
    <div className=" ">
      {isToReview ||isToValidate && (
          <div className="fixed top-0 left-0 w-full h-full bg-transparent z-50 pointer-events-auto" />
        )}
      <Header />

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
        <div className=" max-h-screen min-h-screen">
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
        </div>

        <ConclusionRemediationSection
          selectedMulti={selectedMulti}
          setSelectedMulti={setSelectedMulti}
          shouldShowRemediation={
            selectedMulti === "Partially Applied" ||
            selectedMulti === "Not Applied"
          }
          commentaire={commentaire}
          setCommentaire={setCommentaire}
          action={action}
          handleSubmit={handleSave}
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
          confirmDeleteMission={confirmDeleteMission}
          setIsDeletePopupOpen={setIsDeletePopupOpen}
          selectedActionId={selectedActionId}
          handleDecisionResponse={handleDecisionResponse}
          showDecisionPopup={showDecisionPopup}
          isAddingAnother={isAddingAnother}
          controleID={controleID}
          onClose={onClose}
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
