import React, { useContext, useEffect } from "react";
import HeaderBis from "../components/Header/HeaderBis";
import SideBar from "../components/sideBar/SideBar";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Table from "../components/Table";
import { Button } from "@mui/material";
import { red } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import { SquarePen } from "lucide-react";
import ControlModalWindow from "../components/ModalWindows/ControlModalWindow";
import RiskModalWindow from "../components/ModalWindows/RiskModalWindow";
import ImportCsvButton from "../components/ImportXcelButton";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { PermissionRoleContext } from "../Context/permissionRoleContext";
import useReferentiel from "../Hooks/useReferentiel";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import AddRisqueForm from "../components/Forms/AddRisqueForm";
import AddControlForm from "../components/Forms/AddControleForm";

import DecisionPopUp from "../components/PopUps/DecisionPopUp";
import { useAuth } from "../Context/AuthContext";
const ManageControls = () => {
   const { viewMode, changeViewMode, user } = useAuth();
  
    useEffect(() => {
      if (user?.role === 'admin' && viewMode !== 'admin') {
        changeViewMode('admin');
      }
    }, [user, viewMode, changeViewMode]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRisk, setIsOpenRisk] = useState(false);
  const [transformedData, setTransformeData] = useState({});
  const [riskTransformedData, setRiskTransformeData] = useState({});
  const { userRole, setUserRole } = useContext(PermissionRoleContext);
  const [showPopup, setShowPopup] = useState(false);
  const [insertionProgress, setInsertionProgress] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCntrlFormOpen, setIsCntrlFormOpen] = useState(false);
  const [selectedControls, setSelectedControls] = useState([]);
  const [selectedRisks, setSelectedRisks] = useState([]);
  const [openMultipleDeleteDialog, setOpenMultipleDeleteDialog] =
    useState(false);
  const {
    risksData,
    loading,
    error,
    updateRisk,
    deleteMultipleRisks,
    deleteRisk,
    setRisksData,
    createMultipleRisks,
    createRisk,
    controlsData,
    createMultipleControls,
    setControlsData,
    createControl,
    updateControl,
    deleteControl,
    archiveControl,
    deleteMultipleControls,
  } = useReferentiel();

  const handleRowSelectionChange1 = (newRowSelectionModel) => {
    const selectedRow = newRowSelectionModel; // On suppose qu'une seule ligne est sélectionnée

    // Transformation des données dans le format attendu
    const transformedData = {
      id: selectedRow.id, // ID
      Code: selectedRow.code, // Code
      Type: selectedRow.type || ["", "Unknown"], // Assurez-vous que 'type' existe
      CntrlDescription: selectedRow.description, // Description du contrôle
      TestScript: selectedRow.testScript, // Test script
      Sources: selectedRow.sources.map(([id, name]) => [id, name]), // Liste des sources
      MajorProcess: {
        Code: selectedRow.majorProcessCode, // Code du processus majeur
        Designation: selectedRow.majorProcess, // Désignation du processus majeur
      },
      SubProcess: {
        Code: selectedRow.subProcessCode, // Code du sous-processus
        Designation: selectedRow.subProcess, // Désignation du sous-processus
      },
    };

    // Maintenant vous pouvez utiliser transformedData, par exemple l'envoyer dans un modal
    console.log("transformed  data " + transformedData);
    setIsOpen(true);
    setTransformeData(transformedData);
    //setModalData(transformedData); // Si vous utilisez un modal pour afficher les données
  };

  const closeWindow = () => {
    setIsOpen(false);
  };

  const formatRisksData = (data) => {
    return data.map((row) => ({
      code: row[0],
      name: row[1],
      description: row[2],
    }));
  };
  const findIdByName = (list, name) => {
    if (!list || !name) return null;
    const found = list.find((item) => item[1] === name);
    return found ? { id: found[0], name } : null;
  };

  const findControlByCode = (controls, code) => {
    return controls.find((control) => control.code === code);
  };

  const formatControlsData = (data, controlsData) => {
    if (!Array.isArray(data) || data.length < 2) return { controls: [] };
    if (!Array.isArray(controlsData)) {
      console.error("controlsData n'est pas un tableau valide :", controlsData);
      return { controls: [] };
    }

    const formattedData = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row.length === 0) continue; // Ignorer les lignes vides

      // Vérifier si le contrôle existe déjà
      const existingControl = findControlByCode(controlsData, row[0]);
      if (existingControl) continue; // Ignorer si le contrôle existe déjà

      const control = {
        code: row[0] || null,
        description: row[1] || null,
        test_script: row[2] || null,
        type: row[3]
          ? {
              id:
                findIdByName(
                  controlsData.map((c) => c.type),
                  row[3]
                ) || null,
              name: row[3] || null,
            }
          : null,
        majorProcess: row[4]
          ? {
              id:
                findIdByName(
                  controlsData.map((c) => c.majorProcess),
                  row[4]
                ) || null,
              code: row[4] || null,
              description: row[5] || null,
            }
          : null,
        subProcess: row[6]
          ? {
              id:
                findIdByName(
                  controlsData.map((c) => c.subProcess),
                  row[6]
                ) || null,
              code: row[6] || null,
              name: row[7] || null,
            }
          : null,
        sources: row[8]
          ? row[8].split(",").map((name) => {
              const trimmedName = name.trim();
              const sourceId = findIdByName(
                controlsData.flatMap((c) => c.sources),
                trimmedName
              );
              return {
                id: sourceId || null, // Met null si l'ID n'est pas trouvé
                name: sourceId ? undefined : trimmedName, // Met le nom seulement si l'ID est null
              };
            })
          : [],
      };

      formattedData.push(control);
    }

    console.log("Formatted Data:", formattedData);
    return formattedData;
  };

  const handleDataImported = (data) => {
    console.log("Données importées :", data);
  };

  const handleConfirmInsertion = async (data) => {
    console.log("Insertion des données en cours...", data);

    try {
      await createMultipleRisks(data); // Appel de la fonction du hook pour insérer les données
    } catch (error) {
      console.error("Erreur:", error);
    }
  };
  const handleConfirmCntrlInsertion = async (data) => {
    console.log("Insertion des données en cours...", data);

    try {
      await createMultipleControls(data); // Appel de la fonction du hook pour insérer les données
    } catch (error) {
      console.error("Erreur:", error);
    }
  };
  const infosCntrl = {
    Code: "32",
    Type: [1, "préventif"],

    CntrlDescription: "Description du contrôle",
    TestScript: "Test script du contrôle",
    Sources: [
      [1, "Source 1"],
      [2, "Source 2"],
    ],

    MajorProcess: {
      Code: "MP32",
      Designation: "Processus majeur",
    },
    SubProcess: {
      Code: "SP32",
      Designation: "Sous-processus",
    },
  };

  const handleRiskRowSelectionChange = (newRowSelectionModel) => {
    const selectedRow = newRowSelectionModel; //  ligne sélectionnée

    // Transformation des données dans le format attendu
    const transformedData = {
      id: selectedRow.id,
      Code: selectedRow.code,
      Nom: selectedRow.nomRisque,
      Description: selectedRow.description,
    };

    console.log("transformedData" + transformedData);
    setIsOpenRisk(true);
    setRiskTransformeData(transformedData);
    console.log("risk transformed data", riskTransformedData);
  };
  const closeRiskWindow = () => {
    setIsOpenRisk(false);
  };
  const handleUpdateRisk = async (id, updatedData) => {
    try {
      const response = await updateRisk(id, updatedData);
     

      closeRiskWindow();
    } catch (error) {
      
      toast.error("Échec de la mise à jour du risque !");
    }
  };
  const handleArchiveRow = () => {};
  const handleEditRiskRow = () => {};
  const handleEditCntrlRow = (rowData) => {
    console.log("Modifier le contrôle :", rowData.majorProcessCode);
  };

  const cntrlRowActions = [
    {
      icon: <ArchiveIcon sx={{ marginRight: "5px" }} />,
      label: "Archiver",
      onClick: (selectedRow) => {
        console.log(
          "L'objet de la ligne sélectionnée pour l'archivage : ",
          selectedRow
        );
        setSelectedControl(selectedRow);
        handleArchiveControl();
      },
    },
    {
      icon: <DeleteIcon sx={{ marginRight: "5px" }} />,
      label: "Supprimer",
      onClick: (selectedRow) => {
        handleDeleteControlClick(selectedRow);
      },
    },
    {
      icon: <SquarePen className="mr-2" />,
      label: "Modifier",
      onClick: (selectedRow) => {
        console.log("L'objet de la ligne sélectionnée : ", selectedRow);
        handleRowSelectionChange1(selectedRow);
      },
    },
  ];

  const onRisqueCreated = async (newRisque) => {
    console.log("Nouveau risque à ajouter :", newRisque);
    try {
      await createRisk(newRisque);
    } catch (error) {
      console.error("Erreur lors de la création du risque", error);
    }
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [selectedControl, setSelectedControl] = useState(null);
  const [openDeleteControlDialog, setOpenDeleteControlDialog] = useState(false);
  const [openMultipleControlDeleteDialog, setOpenMultipleControlDeleteDialog] = useState(false);

  const handleDeleteControlClick = (selectedRow) => {
    setSelectedControl(selectedRow);
    setOpenDeleteControlDialog(true);
  };
  const handleDeleteClick = (selectedRow) => {
    setSelectedRisk(selectedRow);
    setOpenDialog(true);
  };

  const handleConfirmControlDelete = async () => {
    if (!selectedControl?.id) {
      toast.error("ID invalide, suppression impossible !");
      return;
    }

    const success = await deleteControl(selectedControl.id); // Appel à la fonction de suppression du hook

    setOpenDeleteControlDialog(false);
  };
  const handleArchiveControl = async () => {
    if (!selectedControl?.id) {
      toast.error("ID invalide, archivage impossible !");
      return;
    }
    await archiveControl(selectedControl.id);
  };
  const handleConfirmDelete = async () => {
    if (!selectedRisk?.id) {
      toast.error("ID invalide, suppression impossible !");
      return;
    }

    const success = await deleteRisk(selectedRisk.id); // Appel à la fonction de suppression du hook
    if (success) {
      toast.success("Risque supprimé avec succès !");
      setRisksData((prev) =>
        prev.filter((risk) => risk.id !== selectedRisk.id)
      );
    }

    setOpenDialog(false);
  };
  const riskRowActions = [
    {
      icon: <DeleteIcon sx={{ marginRight: "5px" }} />,
      label: "Supprimer",
      onClick: handleDeleteClick,
    },
    {
      icon: <SquarePen className="mr-2" />,
      label: "Modifier",
      onClick: (selectedRow) => {
        console.log("L'objet de la ligne sélectionnée : ", selectedRow);
        handleRiskRowSelectionChange(selectedRow);
      },
    },
  ];

  const riskColumnsConfig = [
    { field: "code", headerName: "Code", width: 140, editable: false },
    {
      field: "nomRisque",
      headerName: "Nom du risque",
      width: 180,
      editable: false,
      expandable: true,
      maxInitialLength: 80,
    },

    {
      field: "description",
      headerName: "Description",
      width: 600,
      expandable: true,
      maxInitialLength: 80,
    },
    { field: "actions", headerName: "Actions", width: 80 },
  ];

  const controlColumnsConfig = [
    { field: "code", headerName: "Code", width: 140, editable: false },
    {
      field: "description",
      headerName: "Contrôle",
      width: 280,
      editable: false,
      expandable: true,
      maxInitialLength: 70,
    },

    {
      field: "type",
      headerName: "Type",
      width: 200,
      editable: false,
      renderCell: (params) =>
        Array.isArray(params.value) ? params.value[1] || "No type" : "No type",
    },
    {
      field: "majorProcess",
      headerName: "Major Process",
      width: 250,
      expandable: true,
      editable: false,
    },
    {
      field: "majorProcessCode",
      headerName: "Code Major Process",
      width: 120,
      editable: false,
      renderCell: (params) => params.value || "N/A", // Valeur par défaut si absente
    },
    {
      field: "subProcess",
      headerName: "Sub Process",
      width: 180,
      expandable: true,
      editable: false,
    },
    {
      field: "subProcessCode",
      headerName: "Code Sub Process",
      width: 120,
      editable: false,
      renderCell: (params) => params.value || "N/A", // Valeur par défaut si absente
    },
    {
      field: "testScript",
      headerName: "Test Script",
      width: 260,
      expandable: true,
      maxInitialLength: 70,
      editable: false,
    },
    {
      field: "sources",
      headerName: "Sources",
      width: 200,
      editable: false,
      expandable: true,
      renderCell: (params) =>
        Array.isArray(params.value)
          ? params.value.map((s) => s[0][0] || "Unknown").join(", ")
          : "No sources", // Gestion des valeurs absentes ou non conformes
    },
    { field: "actions", headerName: "Actions", width: 80 },
  ];

  const controlsData1 = [
    {
      id: 7,
      code: "test",
      description: "Duties are separated...",
      type: [1, "Préventif"],

      majorProcess: "Technique",
      majorProcessCode: "MP33", // Ajouter null au lieu de l'ignorer
      subProcess: "Physique",
      subProcessCode: "SB33",
      sources: [
        [1, "Source 1"],
        [2, "Source 2"],
      ], // Mettre une liste vide si aucune source n'est disponible
      testScript:
        "Verify if duties and responsibilities are clearly defined and separated.",
    },
    {
      id: 7,
      code: "PIS.2201a",
      description: "Duties and areas of responsibility are separated...",
      type: [2, "détéctif"],

      majorProcess: "Technique",
      majorProcessCode: "MP33", // Ajouter null au lieu de l'ignorer
      subProcess: "Physique",
      subProcessCode: "SB33",
      sources: [
        [1, "Source 1"],
        [2, "Source 2"],
      ], // Mettre une liste vide si aucune source n'est disponible
      testScript:
        "Verify if duties and responsibilities are clearly defined and separated.",
    },
  ];

  const [selectedRows, setSelectedRows] = useState([]);
  const handleControlSelectionChange = (selectedRows) => {
    console.log("Lignes sélectionnées :", selectedRows);
    setSelectedControls(selectedRows); 
  };
  const handleSelectionChange = (selectedRows) => {
    console.log("Lignes sélectionnées :", selectedRows);
    setSelectedRisks(selectedRows); 
  };


  const handleConfirmDeleteMultipleControls = async () => {
    if (selectedControls.length === 0) {
      toast.error("Aucun controle sélectionné !");
      return;
    }
    const ids = selectedControls.map((control) => control.id);
    try {
      await deleteMultipleControls(ids); 
      setSelectedControls([]); // Réinitialisation de la sélection après suppression
      setOpenMultipleControlDeleteDialog(false); // Fermeture de la popup
    } catch (error) {
      console.error("Erreur lors de la suppression multiple :", error);
    }

    setOpenMultipleControlDeleteDialog(false);
  };



  const handleConfirmDeleteMultiple = async () => {
    if (selectedRisks.length === 0) {
      toast.error("Aucun risque sélectionné !");
      return;
    }
    const ids = selectedRisks.map((risk) => risk.id);
    try {
      await deleteMultipleRisks(ids); // Appel de la fonction pour supprimer
      setSelectedRisks([]); // Réinitialisation de la sélection après suppression
      setOpenMultipleDeleteDialog(false); // Fermeture de la popup
    } catch (error) {
      console.error("Erreur lors de la suppression multiple :", error);
    }

    setOpenMultipleDeleteDialog(false);
  };
  const handleControleCreated = async (newControle) => {
    console.log("Nouveau contrôle créé :", newControle);
    try {
      await createControl(newControle);
    } catch (error) {
      console.error("Erreur lors de la création du contrôle :", error);
    }
  };
  const handleControlUpdated = async (controlData, ControlId) => {
    console.log("control data", controlData, ControlId);
    try {
      await updateControl(ControlId, controlData);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contrôle", error);
    }
  };
  return (
    <div className="flex flex-1 min-h-screen bg-[#fbfcfe]">
      {isOpen && (
        <ControlModalWindow
          isOpen={isOpen}
          onClose={closeWindow}
          onControlUpdated={handleControlUpdated}
          infosCntrl={transformedData}
        />
      )}

      {isOpenRisk && (
        <RiskModalWindow
          isOpen={isOpenRisk}
          onClose={closeRiskWindow}
          infosRisk={riskTransformedData}
          onUpdateRisk={handleUpdateRisk}
        />
      )}
      {/* Barre latérale */}

      <SideBar user={user} />

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 p-4 bg-[#fbfcfe] min-h-screen overflow-hidden">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-1">
          <h1 className="text-xl font-bold">Référentiels</h1>
          <HeaderBis />
        </div>

        {/* Contenu des onglets */}
        <div className="w-full flex-1  relative   ">
          <Tabs
            color="success"
            aria-label="Basic tabs"
            defaultValue={0}
            sx={{
              "--Tabs-spacing": "5px",
              "& .css-ed3i2m-JoyTabList-root": {
                backgroundColor: "transparent",
              },
            }}
          >
            <div className="flex  justify-start">
              {/* Liens en haut */}
              <TabList className="w-full border-b">
                <Tab sx={{ "--Tab-indicatorThickness": "2px" }}>Risques</Tab>
                <Tab sx={{ "--Tab-indicatorThickness": "2px" }}>Contrôles</Tab>
              </TabList>
            </div>

            <div className="flex justify-center ml-2 mt-2">
              {/* Contenu des onglets */}
              <TabPanel
                sx={{
                  "& .MuiTabPanel-root": {
                    backgroundColor: "transparent",
                  },
                }}
                value={0}
                className="h-full flex-1 w-full   "
              >
                <div className="flex justify-end bg-transparent gap-4 p-4 items-start">
                  <ImportCsvButton
                    onDataImported={handleDataImported}
                    onConfirmInsertion={handleConfirmInsertion}
                    formatData={formatRisksData}
                  />
                  <Button
                    variant="contained"
                    onClick={() => setIsFormOpen(true)}
                  >
                    Ajouter un risque
                  </Button>
                  {selectedRisks.length > 0 && (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setOpenMultipleDeleteDialog(true)}
                      disabled={selectedRisks.length === 0} // Désactive si rien n'est sélectionné
                    >
                      Supprimer 
                    </Button>
                  )}
                  {isFormOpen && (
                    <AddRisqueForm
                      title="Ajouter un nouveau risque"
                      isOpen={isFormOpen}
                      onClose={() => setIsFormOpen(false)}
                      onRisqueCreated={onRisqueCreated}
                    />
                  )}{" "}
                </div>
                <div className="overflow-auto h-[calc(98vh-200px)] mb-16  py-7 flex justify-center">
                  {loading ? (
                    <div className="flex items-center justify-center w-full h-full">
                      <Spinner color="var(--blue-menu)" />
                    </div>
                  ) : risksData.length === 0 ? (
                    <p className="text-center text-subfont-gray mt-48">
                      Aucun risque pour le moment. Vous pouvez charger un
                      fichier Excel ?
                    </p>
                  ) : (
                    <Table
                      columnsConfig={riskColumnsConfig}
                      rowsData={risksData}
                      checkboxSelection={true}
                      onSelectionModelChange={setSelectedRisks}
                      onSelectionChange={handleSelectionChange}
                      rowActions={riskRowActions}
                      allterRowcolors={true}
                      className="w-full"
                    />
                  )}

                  {openMultipleDeleteDialog && (
                    <DecisionPopUp
                      name="Cette action est irréversible."
                      text="Êtes-vous sûr de vouloir supprimer ces risques ?"
                      loading={loading}
                      handleConfirm={handleConfirmDeleteMultiple} // Appelle la suppression multiple
                      handleDeny={() => setOpenDialog(false)}
                    />
                  )}
                  {openDialog && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                      <DecisionPopUp
                        name="Cette action est irréversible."
                        text="Êtes-vous sûr de vouloir supprimer ce risque ?"
                        loading={loading}
                        handleConfirm={handleConfirmDelete}
                        handleDeny={() => setOpenDialog(false)}
                      />
                    </div>
                  )}
                </div>
              </TabPanel>

              <TabPanel
                sx={{
                  "& .MuiTabPanel-root": {
                    backgroundColor: "green",
                  },
                }}
                value={1}
                className="h-full flex-1 w-full"
              >
                {/* Boutons en dehors de la zone de défilement */}
                <div className="flex justify-end bg-transparent gap-4 p-4">
                  <ImportCsvButton
                    onDataImported={handleDataImported}
                    onConfirmInsertion={handleConfirmCntrlInsertion}
                    formatData={(data) =>
                      formatControlsData(data, controlsData)
                    }
                  />
                  <Button
                    variant="contained"
                    onClick={() => setIsCntrlFormOpen(true)}
                  >
                    Ajouter un contrôle
                  </Button>
                  {selectedControls.length > 0 && (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setOpenMultipleControlDeleteDialog(true)}
                      disabled={selectedControls.length === 0} // Désactive si rien n'est sélectionné
                    >
                      Supprimer 
                    </Button>
                  )}
                </div>

                <div
                  style={{
                    overflow: "auto",
                    maxHeight: "400px",
                    minHeight: "400px",
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center mt-9 w-full h-full">
                      <Spinner color="var(--blue-menu)" />
                    </div>
                  ) : controlsData.length === 0 ? (
                    <p className="text-center text-subfont-gray mt-48">
                      Aucun contrôle pour le moment. Vous pouvez charger un
                      fichier Excel ?
                    </p>
                  ) : (
                    <Table
                      columnsConfig={controlColumnsConfig}
                      rowsData={controlsData}
                      checkboxSelection={true}
                      rowActions={cntrlRowActions}
                      onSelectionModelChange={setSelectedControls}
                      onSelectionChange={handleControlSelectionChange}
                      allterRowcolors
                      className="w-full"
                    />
                  )}
                  {openMultipleControlDeleteDialog && (
                    <DecisionPopUp
                      name="Cette action est irréversible."
                      text="Êtes-vous sûr de vouloir supprimer ces controles ?"
                      loading={loading}
                      handleConfirm={handleConfirmDeleteMultipleControls} // Appelle la suppression multiple
                      handleDeny={() => setOpenMultipleControlDeleteDialog(false)}
                    />
                  )}
                  {openDeleteControlDialog && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                      <DecisionPopUp
                        name="Cette action est irréversible."
                        text="Êtes-vous sûr de vouloir supprimer ce controle ?"
                        loading={loading}
                        handleConfirm={handleConfirmControlDelete}
                        handleDeny={() => setOpenDeleteControlDialog(false)}
                      />
                    </div>
                  )}
                  {isCntrlFormOpen && (
                    <AddControlForm
                      title="Ajouter un nouveau contrôle"
                      isOpen={isCntrlFormOpen}
                      onClose={() => setIsCntrlFormOpen(false)}
                      on
                      onControleCreated={handleControleCreated}
                    />
                  )}
                </div>
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ManageControls;
