import React, { useContext } from "react";
import HeaderBis from "../components/Header/HeaderBis";
import SideBar from "../components/sideBar/SideBar";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Table from "../components/Table";
import { Button } from "@mui/material";
import { red } from "@mui/material/colors";
import ArchiveIcon from "@mui/icons-material/Archive";
import { SquarePen } from "lucide-react";
import ControlModalWindow from "../components/ModalWindows/ControlModalWindow";
import RiskModalWindow from "../components/ModalWindows/RiskModalWindow";
import ImportCsvButton from "../components/ImportXcelButton";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { PermissionRoleContext } from "../Context/permissionRoleContext";
const ManageControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRisk, setIsOpenRisk] = useState(false);
  const [transformedData, setTransformeData] = useState({});
  const [riskTransformedData, setRiskTransformeData] = useState({});
  // Accédez à userRole et setUserRole via le contexte
  const { userRole, setUserRole } = useContext(PermissionRoleContext);
  
  // Utilisez userRole dans votre composant
  console.log("Rôle de l'utilisateur :", userRole);

  const handleRowSelectionChange1 = (newRowSelectionModel) => {
    const selectedRow = newRowSelectionModel; // On suppose qu'une seule ligne est sélectionnée

    // Transformation des données dans le format attendu
    const transformedData = {
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
  const closeRiskWindow = () => {
    setIsOpenRisk(false);
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
      Code: selectedRow.code,
      Nom: selectedRow.nomRisque,
      Description: selectedRow.description,
    };

    console.log("transformedData" + transformedData);
    setIsOpenRisk(true);
    setRiskTransformeData(transformedData);
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
  const riskRowActions = [
    {
      icon: <ArchiveIcon sx={{ marginRight: "5px" }} />,
      label: "Archiver",
      onClick: (selectedRow) => {
        console.log(
          "L'objet de la ligne sélectionnée pour l'archivage : ",
          selectedRow
        );
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
      width: 150,
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
      renderCell: (params) =>
        Array.isArray(params.value)
          ? params.value.map((s) => s[0][0] || "Unknown").join(", ")
          : "No sources", // Gestion des valeurs absentes ou non conformes
    },
    { field: "actions", headerName: "Actions", width: 80 },
  ];

  const controlsData = [
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

  return (
    <div className="flex flex-1 min-h-screen bg-[#fbfcfe]">
      {isOpen && (
        <ControlModalWindow
          isOpen={isOpen}
          onClose={closeWindow}
          infosCntrl={transformedData}
        />
      )}

      {isOpenRisk && (
        <RiskModalWindow
          isOpen={isOpenRisk}
          onClose={closeRiskWindow}
          infosRisk={riskTransformedData}
        />
      )}
      {/* Barre latérale */}
  
        <SideBar userRole={userRole} />
      

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
                <div className="flex justify-end bg-transparent gap-4 p-4">
                  <ImportCsvButton />
                  <Button variant="contained">Ajouter un risque</Button>
                </div>
                <div style={{ overflow: "auto", maxHeight: "800px" ,minHeight: "400px",}}>
                  {risksData.length === 0 ? (
                    <p className="text-center text-subfont-gray mt-48">
                      Aucun risque pour le moment. Vous pouvez charger un
                      fichier Excel ?
                    </p>
                  ) : (
                    <Table
                      columnsConfig={riskColumnsConfig}
                      rowsData={risksData}
                      checkboxSelection={false}
                      rowActions={riskRowActions}
                      allterRowcolors={true}
                      className="w-full"
                    />
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
                  <ImportCsvButton />
                  <Button variant="contained">Ajouter un contrôle</Button>
                </div>

                {/* Tableau avec défilement */}
                <div
                  style={{
                    overflow: "auto",
                    maxHeight: "400px",
                    minHeight: "400px",
                  }}
                >
                  {controlsData.length === 0 ? (
                    <p className="text-center align-middle text-subfont-gray mt-48">
                      Aucun contrôle pour le moment. Vous pouvez charger un
                      fichier Excel ?
                    </p>
                  ) : (
                    <Table
                      columnsConfig={controlColumnsConfig}
                      rowsData={controlsData}
                      checkboxSelection={false}
                      rowActions={cntrlRowActions}
                      allterRowcolors={true}
                      className="w-full"
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
