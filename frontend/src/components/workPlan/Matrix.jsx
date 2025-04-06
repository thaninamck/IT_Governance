import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { User, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import useWorkplan from "../../Hooks/useWorkplan";
import Spinner from "../Spinner";
//import SaveIcon from '@mui/icons-material/Save';

import { Select, MenuItem, Checkbox, TextField, Button } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import SearchBar from "../SearchBar";

function Matrix({ data, userRole, onRowClick,handleSaveexecutions }) {
  // Données imbriquées
  const data1 = {
    applications: [
      {
        id: "app1",
        description: "USSD",
        layers: [
          {
            id: "l1",
            name: "OS",
            risks: [
              {
                id: "1",
                nom: "SDLC requirements are not exist or are not conducted.",
                description:
                  "furfuzirfyzuf iuzyfoz ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof",
                owner: "",
                controls: [
                  {
                    id: "4",
                    description:
                      "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification...",
                    majorProcess: "Technical",
                    subProcess: "Access control",
                    testScript:
                      "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
                    owner: "",
                  },
                ],
              },
            ],
          },
          {
            id: "l2",
            name: "APP",
            risks: [],
          },
        ],
        owner: "",
      },
    ],
  };

  const [controlModified,setControlModified]=useState(false);
  const [riskModified,setRiskModified]=useState(false);

  const [flattenedData, setFlattenedData] = useState([]);
  const transformData = (data) => {
    const result = [];
    if (!data || !Array.isArray(data.applications)) {
      console.error("Les données des applications sont manquantes ou incorrectes:", data);
      return [];  // Retourne une liste vide au lieu de planter
    }

    const uniqueIds = new Set(); // Track unique IDs
  
    data.applications.forEach((app) => {
      const appName = app.description;
      const appOwner = app.owner;
  
      app.layers.forEach((layer) => {
        const layerName = layer.name;
  
        layer.risks.forEach((risk) => {
          const riskId=risk.id;
          const riskCode = risk.code;
          const riskName = risk.nom;
          const riskDescription = risk.description;
          const riskOwner = risk.owner;
  
          risk.controls.forEach((control) => {
            const uniqueId = `${app.id}-${layer.id}-${risk.id}-${control.id}`;
  
            // Check if the ID is already in the Set
            if (!uniqueIds.has(uniqueId)) {
              uniqueIds.add(uniqueId); // Add the ID to the Set
  
              result.push({
                id: uniqueId,
                application: appName,
                layerId:Number(layer.id),
                applicationLayer: layerName,
                applicationOwner: appOwner,
                riskId: +riskId,
                riskCode:riskCode,
                riskName: riskName,
                riskDescription: riskDescription,
                riskModified:riskModified,
                riskOwner: riskOwner,
                controlId:Number(control.id),
                controlCode:control.code,
                controlDescription: control.description,
                controlModified:controlModified,
                majorProcess: control.majorProcess,
                subProcess: control.subProcess,
                type: control.type,
                testScript: control.testScript,
                controlOwner: control.owner,
                controlTester: "",
              });
            }
          });
        });
      });
    });
    console.log("Données transformées:", result); // Ajouter un log pour déboguer
    return result;
  };

 

// Fonction pour fusionner les nouvelles données avec flattenedData existant
const mergeData = (newData, existingData) => {
  const mergedData = [...existingData];

  newData.forEach((newItem) => {
    const existingItemIndex = mergedData.findIndex((item) => item.id === newItem.id);

    if (existingItemIndex !== -1) {
      // Si l'élément existe déjà, conservez les modifications de l'utilisateur
      mergedData[existingItemIndex] = {
        ...newItem,
        controlOwner: mergedData[existingItemIndex].controlOwner, // Conservez le propriétaire existant
        controlTester: mergedData[existingItemIndex].controlTester, // Conservez le testeur existant
      };
    } else {
      // Si l'élément n'existe pas, ajoutez-le à mergedData
      mergedData.push(newItem);
    }
  });

  return mergedData;
};

// Charger les données depuis localStorage au montage du composant
 useEffect(() => {
   const savedData = localStorage.getItem("flattenedData");
  if (savedData) {
     const parsedData = JSON.parse(savedData);
    setFlattenedData(parsedData); // Mettre à jour flattenedData avec les données sauvegardées
     console.log("savedData", parsedData); // Vérifier les données chargées
   }
 }, []);

// Mettre à jour flattenedData lorsque data change
useEffect(() => {
  if (data) {
    const transformedData = transformData(data);

    // Utiliser une fonction de mise à jour pour éviter les dépendances cycliques
    setFlattenedData((prevFlattenedData) => {
      const mergedData = mergeData(transformedData, prevFlattenedData);
      console.log("mergedData", mergedData); // Vérifier les données fusionnées
      return mergedData;
    });
  }
}, [data]); // Dépend uniquement de data

// Sauvegarder les données dans localStorage à chaque mise à jour de flattenedData
useEffect(() => {
  if (flattenedData.length > 0) {
    localStorage.setItem("flattenedData", JSON.stringify(flattenedData));
  }
}, [flattenedData]);
 
  const [selectedRisk, setSelectedRisk] = useState({});
  const [selectedApp, setSelectedApp] = useState({});
const {createExecutions,loading}=useWorkplan();
  const [selectedControl, setSelectedControl] = useState({});
  const [testerValues, setTesterValues] = useState({});

  // Données initiales
  const rows = [
    {
      id: 1,
      application: "USSD",
      applicationLayer: "OS",
      applicationOwner: "rezazi",
      riskCode: "FTRM",
      riskName: "SEC log",
      riskDescription: "Security log risk",
      riskOwner: "John Doe",
      controlCode: "PCS214",
      controlDescription: "Supportability",
      majorProcess: "Technical",
      subProcess: "Access control",
      testScript: "Verify logs",
      controlOwner: "Jane Smith",
      controlTester: 1, // ID du testeur
    },
    {
      id: 2,
      application: "USSD",
      applicationLayer: "APP",
      applicationOwner: "rezazi",
      riskCode: "FTRM",
      riskName: "SEC log",
      riskDescription: "Security log risk",
      riskOwner: "John Doe",
      controlCode: "PCS215",
      controlDescription: "Audit Logs",
      majorProcess: "Technical",
      subProcess: "Access control",
      testScript: "Check audit logs",
      controlOwner: "Jane Smith",
      controlTester: 2, // ID du testeur
    },
  ];

  // Liste des testeurs avec id et designation
  const testers = [
    { id: 1, designation: "Testeur 1" },
    { id: 2, designation: "Testeur 2" },
    { id: 3, designation: "Testeur 3" },
    { id: 4, designation: "Testeur 4" },
  ];
  const [selectedTester, setSelectedTester] = useState(testers[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [owner, setOwner] = useState("");

  const updateCells = (selectedItems, rows, ownername) => {
    // Parcours des éléments sélectionnés
    selectedItems.forEach((item) => {
      const { id, type } = item;

      // Recherche de la ligne correspondant à l'ID
      const rowIndex = rows.findIndex((row) => row.id === id);

      if (rowIndex !== -1) {
        // Si l'élément est de type "risk", on met à jour la cellule correspondante
        if (type === "risk") {
          rows[rowIndex].riskOwner = ""; // Remplace par le nom réel

          rows[rowIndex].riskOwner = ownername; // Remplace par le nom réel
        }
        // Si l'élément est de type "control", on met à jour la cellule correspondante
        if (type === "control") {
          rows[rowIndex].controlOwner = ownername; // Remplace par le nom réel
        }
      }
    });
    setFlattenedData(rows);
    return rows; // Retourne les lignes mises à jour
  };

  const handleUpdateOwner = () => {
    updateCells(selectedItems, flattenedData, owner);
    setOwner("");
    setSelectedControl({});
    setSelectedRisk({});
    setSelectedApp({});
    setSelectedItems([]);
  };

  // Gestion des cases à cocher pour les risques
  const handleRiskCheckboxChange = (id) => (event) => {
    console.log("id slcted", id);
    const type = "risk";
    setSelectedItems((prev) => {
      if (event.target.checked) {
        // Si la case est cochée, on ajoute l'objet { id, type }
        return [...prev, { id, type }];
      } else {
        // Si la case est décochée, on retire l'objet { id, type }
        return prev.filter((item) => item.id !== id || item.type !== type);
      }
    });
    setSelectedRisk((prev) => ({
      ...prev,
      [id]: event.target.checked,
    }));
  };

  const atLeastOneApp = flattenedData.length > 0;
  const navigate = useNavigate();

  const handleSave = async () => {
    console.log("flattenedData", flattenedData);
    const dataToSend = {
      executions: flattenedData.map(item => ({
          layerId: item.layerId,
          riskId: item.riskId,
          riskDescription: item.riskDescription,
          riskModified: item.riskModified,
          riskOwner: item.riskOwner,
          controlId: item.controlId,
          controlDescription: item.controlDescription,
          controlModified: item.controlModified,
          controlOwner: item.controlOwner,
          controlTester: item.controlTester
      }))
  };
    // Vérification des champs obligatoires
    const missingFields = flattenedData.some(
        item => !item.controlTester || !item.riskOwner || !item.controlOwner
    );

    if (missingFields) {
        toast.error("Veuillez affecter tous les contrôles à leurs testeurs et tous les risques/contrôles à leurs propriétaires.");
        handleSaveexecutions(dataToSend);
        return;
    }

   

    console.log("dataToSend", dataToSend);
    await createExecutions(dataToSend);
     localStorage.removeItem("flattenedData");
     navigate(-1);
};


  // Gestion des cases à cocher pour les contrôles
  const handleControlCheckboxChange = (id) => (event) => {
    console.log("id slcted", id);
    const type = "control";
    setSelectedItems((prev) => {
      if (event.target.checked) {
        // Si la case est cochée, on ajoute l'objet { id, type }
        return [...prev, { id, type }];
      } else {
        // Si la case est décochée, on retire l'objet { id, type }
        return prev.filter((item) => item.id !== id || item.type !== type);
      }
    });
    setSelectedControl((prev) => ({
      ...prev,
      [id]: event.target.checked,
    }));
  };

  // Gestion des sélections pour les testeurs
  /*const handleTesterChange = (id, testerId) => (event) => {
    const rowIndex = flattenedData.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      flattenedData[rowIndex].controlTester = testerId;
    }
    setTesterValues((prev) => ({
      ...prev,
      [id]: testerId,
    }));
  };*/ //old version


  const handleTesterChange = (id, testerId) => (event) => {
    setFlattenedData((prevData) => {
      return prevData.map((row) => {
        if (row.id === id) {
          return { ...row, controlTester: testerId }; // Update the tester
        }
        return row;
      });
    });
  
    setTesterValues((prev) => ({
      ...prev,
      [id]: testerId,
    }));
  };






  const handleEditStop = (params, event) => {
    console.log("Edition terminée sur la cellule", params);

    // Récupérer l'ID de la ligne et la valeur modifiée
    const { id, field, value } = params;

    // Mettre à jour le tableau de données avec la nouvelle valeur
    setFlattenedData((prevData) => {
      const updatedData = prevData.map((row) => {
        console.log("field",field);
        if (row.id === id) {
          row[field] = value; // Mettre à jour la cellule
         
        }
        return row;
      });
      return updatedData;
    });
  };

  const columns = [
    // Application

    {
      field: "application",
      headerName: "Application",
      width: 150,
      editable: true,
    },
    {
      field: "applicationLayer",
      headerName: "Layer",
      width: 150,
      editable: false,
    },
    {
      field: "applicationOwner",
      headerName: "Owner",
      width: 150,
      editable: false,
    },
    // Risques

    // {
    //      field: "riskCheckbox",
    //   headerName: "Select Risk",
    //   width: 150,
    //   renderCell: (params) => (
    //     <Checkbox
    //       className="riskCheckbox"
    //       checked={!!selectedRisk[params.row.id]}
    //       onChange={handleRiskCheckboxChange(params.row.id)}
    //     />
    //   ),
    //    },
    // ...((userRole === 'manager' || userRole === 'admin')
    // ? [
      {  field: "riskCheckbox",
      headerName: "Select Risk",
      width: 150,
      renderCell: (params) => (
        <Checkbox
          className="riskCheckbox"
          checked={!!selectedRisk[params.row.id]}
          onChange={handleRiskCheckboxChange(params.row.id)}
        />
      ),},
    //]
    //: []),

    
    { field: "riskCode", headerName: "Risk Code", width: 150, editable: false },
    { field: "riskName", headerName: "Risk Name", width: 150, editable: false },
     {
       field: "riskDescription",
       headerName: "Risk Description",
       width: 350,
       editable: false,
     },
    // ...((userRole === 'manager' || userRole === 'admin')
    // ? [{ field: "riskDescription",
    //   headerName: "Risk Description",
    //   width: 200,
    //   editable: false}]
    // : [{ field: "riskDescription",
    //   headerName: "Risk Description",
    //   width: 350,
    //   editable: true}]),
    {
      field: "riskOwner",
      headerName: "Risk Owner",
      width: 150,
      editable: false,
    },

    // Contrôles
    // {
    //   field: "controlCheckbox",
    //   headerName: "Select Control",
    //   width: 150,
    //   renderCell: (params) => (
    //     <Checkbox
    //       className="controlCheckbox"
    //       checked={!!selectedControl[params.row.id]}
    //       onChange={handleControlCheckboxChange(params.row.id)}
    //     />
    //   ),
    // },

    // ...((userRole === 'manager' || userRole === 'admin')
    // ? [
      { field: "controlCheckbox",
      headerName: "Select Control",
      width: 150,
      renderCell: (params) => (
        <Checkbox
          className="controlCheckbox"
          checked={!!selectedControl[params.row.id]}
          onChange={handleControlCheckboxChange(params.row.id)}
        />
      ),}
    // ]
    // : [])
    ,
    {
      field: "controlCode",
      headerName: "Control Code",
      width: 150,
      editable: false,
    },
    {
      field: "controlDescription",
      headerName: "Control Description",
      width: 200,
      editable: true,
    },
    {
      field: "majorProcess",
      headerName: "Major Process",
      width: 150,
      editable: false,
    },
    {
      field: "subProcess",
      headerName: "Sub Process",
      width: 150,
      editable: false,
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
      editable: false,
    },
    {
      field: "testScript",
      headerName: "Test Script",
      width: 150,
      editable: true,
    },
    {
      field: "controlOwner",
      headerName: "Control Owner",
      width: 150,
      editable: false,
    },
    {
      field: "controlTester",
      headerName: "Testeur",
      width: 150,
      renderCell: (params) => (
        <Select
          value={testerValues[params.row.id] || params.row.controlTester || ""}
          onChange={(event) => {
            const selectedTesterId = event.target.value;
            handleTesterChange(params.row.id, selectedTesterId)(event);
          }}
          fullWidth
          variant="outlined"
          size="small"
        >
          {testers.map((tester) => (
            <MenuItem key={tester.id} value={tester.id}>
              {tester.designation}
            </MenuItem>
          ))}
        </Select>
      ),
    },
  ];

  const handleUpdateTesters = (selectedTester) => {
    selectedItems.forEach((item) => {
      const { id, type } = item;

      if (type === "control") {
        const fakeEvent = { target: { value: selectedTester } }; // Simule l'événement avec l'objet testeur
        handleTesterChange(id, selectedTester.id)(fakeEvent);
      }
    });

    setSelectedItems([]); // Réinitialiser les sélections
    setSelectedControl({});
  };

  const [editMessage, setEditMessage] = useState("");

  
  const handleRowClick = (params) => {
    if (onRowClick) {
      onRowClick(params.row);

    }
  };

  return (
    <>
      <div className="flex  items-center justify-start mb-6">
        

      </div>
      {(true) &&
        <div className="flex items-center gap-4 justify-end my-5 mr-4 space-x-4"
          //style={{ display: (userRole === 'admin' || userRole === 'manager') ? 'none' : 'flex' }}
          >
          {/* Label */}
          <label className="text-gray-900 font-semibold">Owner</label>

          {/* Input Field */}
          <div className="relative flex items-center bg-white rounded-md border border-gray-300 w-60 px-3 py-2">
            <User className="text-gray-500 mr-2" size={16} />
            <input
              type="text"
              onChange={(e) => setOwner(e.target.value)}
              className="bg-transparent outline-none w-full"
              placeholder="Owner"
              value={owner}
            />
          </div>
          <div>{editMessage && <p>{editMessage}</p>}</div>

          {/* Button */}
          <button
            onClick={handleUpdateOwner}
            className="bg-blue-menu text-white px-4 py-2 rounded-md hover:bg-blue-900"
          >
            Ajouter
          </button>

          <div className="flex items-center  space-x-4">
            {/* Label */}
            <label className="text-gray-900 font-semibold">Testeur</label>

            {/* Dropdown */}
            <div className="relative z-30 w-60">
              <div
                className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-2 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <User className="text-gray-500 mr-2" size={16} />
                <span className="flex-1 text-gray-700">
                  {selectedTester.designation}
                </span>
                <ChevronDown className="text-gray-500" size={16} />
              </div>
              {isOpen && (
                <ul className="absolute w-full bg-white border border-gray-300 rounded-md shadow-md mt-1">
                  {testers.map((tester) => (
                    <li
                      key={tester.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedTester(tester);
                        handleUpdateTesters(tester);
                        setIsOpen(false);
                      }}
                    >
                      {tester.designation}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="   ">
            {atLeastOneApp && (
              <button
                onClick={handleSave}
                className="bg-blue-menu text-white px-4 py-2 rounded-md hover:bg-blue-900"
              >
                {loading ? (<Spinner color="white" size={25}/>) : "save"} 
              </button>
            )}
          </div>
        </div>
      }

      <div className="mr-4">
        <TableContainer component={Paper} className="overflow-auto ">
          <Table>
            <TableHead>
              <TableRow className="bg-blue-nav">
                {/* Application */}
                <TableCell
                  align="center"
                  style={{ width: 450 }}
                  className="border border-subfont-gray"
                >
                  Application
                </TableCell>

                {/* Risques */}
                <TableCell
                  align="center"
                  style={{ width: 950 }}
                  className="border border-subfont-gray"
                >
                  Risques
                </TableCell>

                {/* Contrôles */}
                <TableCell
                  colSpan={6} // 7 colonnes pour Contrôles
                  align="center"
                  className="border border-subfont-gray"
                >
                  Contrôles
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell colSpan={14} style={{ padding: 0 }}>
                  <Paper style={{ height: 550, width: "100%" }}>
                    <DataGrid
                      sx={{
                        // Style pour les en-têtes de colonnes
                        "& .MuiDataGrid-columnHeader": {
                          backgroundColor: "#E9EFF8", // Couleur de fond verte
                        },
                        // Style pour les lignes au survol
                        "& .MuiDataGrid-row:hover": {
                          backgroundColor: "#E8F5E9", // Couleur de fond au survol
                        },
                      }}
                      rows={flattenedData}
                      onRowClick={handleRowClick}
                      // rows={searchResults} 
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5, 10, 20]}
                      editMode="cell"
                      onCellEditStop={(params, event) => {
                        console.log("Edition terminée sur la cellule", params);

                        const { id, field } = params;
                        const newValue = event.target.value;

                        // Mettre à jour le tableau de données avec la nouvelle valeur
                        setFlattenedData((prevData) => {
                          const updatedData = prevData.map((row) => {
                            if (row.id === id) {
                              console.log("le row est trouvé", field);
                              row[field] = newValue; // Mettre à jour la cellule
                              switch (field) {
                                case 'controlDescription':
                                  row['controlModified']=true
                                  break;
                               
                                case 'riskDescription':
                                row['riskModified']=true
                                  break;
                               }
                            }
                            return row;
                          });
                          return updatedData;
                        });
                      }}
                    //disableSelectionOnClick
                    />
                  </Paper>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default Matrix;
