import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { User, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import useWorkplan from "../../Hooks/useWorkplan";
import { useNavigationType } from "react-router-dom";
import Spinner from "../Spinner";
import { Trash } from "lucide-react";
import DecisionPopUp from "../PopUps/DecisionPopUp"; //import SaveIcon from '@mui/icons-material/Save';

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
import NotificationPopup from "../Notification/NotificationPopup";

function Matrix({
  data,
  user,
  onRowClick,
  handleSaveexecutions,
  fromScopeModification,
  unlockModification,
  stopModification,
  viewOnly,
  missionId
}) {
  const {
    createExecutions,
    loading,
    testers,
    saveloading,
    deleteExecutions,
    updateMultipleExecutions,
  } = useWorkplan(missionId);
  const [saveWork, setSaveWork] = useState(false);
  const [flattenedData, setFlattenedData] = useState([]);
  const [selectedControls, setSelectedControls] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [selectedRisk, setSelectedRisk] = useState({});
  const [selectedApp, setSelectedApp] = useState({});
  const [selectedControl, setSelectedControl] = useState({});
  const [testerValues, setTesterValues] = useState({});
  const [selectedTester, setSelectedTester] = useState([]);
  const [editMessage, setEditMessage] = useState("");
  const atLeastOneApp = flattenedData.length > 0;
  const [modify, setModify] = useState(true);
  const navigate = useNavigate();
  //const [selectedTester, setSelectedTester] = useState(testers[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [owner, setOwner] = useState("");
  const [controlModified, setControlModified] = useState(false);
  const [riskModified, setRiskModified] = useState(false);

  const transformData = (data) => {
    console.warn("dattaaaaa", data);
    const result = [];
    if (!data || !Array.isArray(data.applications)) {
      console.error(
        "Les données des applications sont manquantes ou incorrectes:",
        data
      );
      return []; // Retourne une liste vide au lieu de planter
    }

    const uniqueIds = new Set(); // Track unique IDs

    data.applications.forEach((app) => {
      const appName = app.description;
      const appOwner = app.owner;

      app.layers.forEach((layer) => {
        const layerName = layer.name;

        layer.risks.forEach((risk) => {
          const riskId = risk.id;
          const riskCode = risk.code;
          const riskName = risk.nom;
          const riskDescription = risk.description;
          const riskOwner = risk.owner;

          risk.controls.forEach((control) => {
            const uniqueId = `${app.id}-${layer.id}-${risk.id}-${control.id}`;

            // Check if the ID is already in the Set
            if (!uniqueIds.has(uniqueId)) {
              uniqueIds.add(uniqueId); // Add the ID to the Set
              console.log("controlpp", control);
              result.push({
                id: uniqueId,
                application: appName,
                layerId: Number(layer.id),
                applicationLayer: layerName,
                applicationOwner: appOwner,
                riskId: +riskId,
                riskCode: riskCode,
                riskName: riskName,
                riskDescription: riskDescription,
                riskModified: riskModified,
                riskOwner: riskOwner,
                controlId: Number(control.id),
                controlCode: control.code,
                controlDescription: control.description,
                controlModified: controlModified,
                majorProcess: control.majorProcess,
                subProcess: control.subProcess,
                type: control.type,
                testScript: control.testScript,
                controlOwner: control.owner,
                // controlTester: "",
                executionId: control.executionId,
                covId: control.covId,
                controlTester: control.controlTester,
                modifiable: !viewOnly,
              });
            }
          });
        });
      });
    });
    //  console.log("Données transformées:", result); // Ajouter un log pour déboguer
    return result;
  };


 
  
  
  // Fonction pour fusionner les nouvelles données avec flattenedData existant
  const mergeData = (newData, existingData) => {
    const mergedData = [...existingData];
  
    newData.forEach((newItem) => {
      const existingItemIndex = mergedData.findIndex(
        (item) => item.id === newItem.id
      );
  
      if (existingItemIndex !== -1) {
        const existingItem = mergedData[existingItemIndex];
  
        // Vérifier s'il y a une différence entre existingItem et newItem
        const hasDifference = Object.keys(newItem).some((key) => {
          return newItem[key] !== existingItem[key];
        });
  
        if (!hasDifference) {
          // Si aucune différence, tu peux décider de garder l'existant ou le remplacer
          // mergedData[existingItemIndex] = newItem; // optionnel
        }
  
        // Sinon (s'il y a une différence), on garde existingItem tel quel (rien à faire)
      } else {
        // Si c’est un nouvel élément, on l’ajoute
        mergedData.push(newItem);
      }
    });
  
    return mergedData;
  };
  

  const handleEditStop = (params, event) => {
    console.log("Edition terminée sur la cellule", params);

    // Récupérer l'ID de la ligne et la valeur modifiée
    const { id, field, value } = params;

    // Mettre à jour le tableau de données avec la nouvelle valeur
    setFlattenedData((prevData) => {
      const updatedData = prevData.map((row) => {
        console.log("field", field);
        if (row.id === id) {
          row[field] = value; // Mettre à jour la cellule
        }
        return row;
      });
      return updatedData;
    });
  };
  const [controlsToUpdate, setControlsToUpdate] = useState([]); // État pour stocker les contrôles à mettre à jour
  const columns = [
    // Application

    {
      field: "application",
      headerName: "Application",
      width: 150,
      editable: false,
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
    {
      field: "riskCheckbox",
      headerName: "Select Risk",
      width: 150,
      renderCell: (params) => (
        <Checkbox
          className="riskCheckbox"
          checked={!!selectedRisk[params.row.id]}
          onChange={handleRiskCheckboxChange(params.row.id)}
        />
      ),
    },
    //]
    //: []),

    { field: "riskCode", headerName: "Risk Code", width: 150, editable: false },
    { field: "riskName", headerName: "Risk Name", width: 150, editable: false },
    {
      field: "riskDescription",
      headerName: "Risk Description",
      width: 350,
      editable: true,
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
      editable: true,
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
    {
      field: "controlCheckbox",
      headerName: "Select Control",
      width: 150,
      renderCell: (params) => (
        <Checkbox
          className="controlCheckbox"
          checked={!!selectedControl[params.row.id]}
          onChange={handleControlCheckboxChange(params.row.id)}
        />
      ),
    },
    // ]
    // : [])
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
      editable: false,
    },
    {
      field: "controlOwner",
      headerName: "Control Owner",
      width: 150,
      editable: true,
    },
    {
      field: "controlTester",
      headerName: "Testeur",
      width: 150,
      renderCell: (params) => {
        return (
          <Select
            value={
              testerValues[params.row.id] || params.row.controlTester || ""
            }
            onChange={(event) => {
              const selectedTesterId = event.target.value;
              handleTesterChange(params.row.id, selectedTesterId)(event);
            }}
            fullWidth
            variant="outlined"
            size="small"
          >
            {loading ? (
              <MenuItem disabled>Chargement...</MenuItem>
            ) : testers.length > 0 ? (
              testers.map((tester) => (
                <MenuItem key={tester.id} value={tester.id}>
                  {tester.designation}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Aucun testeur trouvé</MenuItem>
            )}
          </Select>
        );
      },

      // renderCell: (params) => {
      //   const controlTester = testerValues[params.row.id];
      //  // console.log('testeur',controlTester)

      //   return controlTester ? (
      //     <span>{controlTester}</span>
      //   ) :
      //     <Select
      //       value={testerValues[params.row.id] || params.row.controlTester || ""}
      //       onChange={(event) => {
      //         const selectedTesterId = event.target.value;
      //         handleTesterChange(params.row.id, selectedTesterId)(event);
      //       }}
      //       fullWidth
      //       variant="outlined"
      //       size="small"
      //     >
      //       {loading ? (
      //         <MenuItem disabled>Chargement...</MenuItem>
      //       ) : testers.length > 0 ? (
      //         testers.map((tester) => (
      //           <MenuItem key={tester.id} value={tester.id}>
      //             {tester.designation}
      //           </MenuItem>
      //         ))
      //       ) : (
      //         <MenuItem disabled>Aucun testeur trouvé</MenuItem>
      //       )}
      //     </Select>

      // },
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

  const handleRowClick = (params) => {
    if (onRowClick) {
      onRowClick(params.row);
    }
  };

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

  // Gestion des cases à cocher pour les contrôles
  const handleControlCheckboxChange = (id) => (event) => {
    // console.log("id slcted", id);
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
    // console.log("id slcted", id);
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

  const handleSave = async () => {
    // console.log("flattenedData", flattenedData);
    const dataToSend = {
      executions: flattenedData.map((item) => ({
        layerId: item.layerId,
        riskId: item.riskId,
        riskDescription: item.riskDescription,
        riskModified: item.riskModified,
        riskOwner: item.riskOwner,
        controlId: item.controlId,
        missionName:JSON.parse(localStorage.getItem("missionData"))?.missionName ||"non définie",
        controlDescription: item.controlDescription,
        controlModified: item.controlModified,
        controlOwner: item.controlOwner,
        controlTester: item.controlTester,
      })),
    };
    // Vérification des champs obligatoires
    const missingFields = flattenedData.some(
      (item) => !item.controlTester || !item.riskOwner || !item.controlOwner
    );

    if (missingFields) {
      toast.error(
        "Veuillez affecter tous les contrôles à leurs testeurs et tous les risques/contrôles à leurs propriétaires."
      );
      handleSaveexecutions(dataToSend);
      return;
    }

    console.log("dataToSend", dataToSend);
    await createExecutions(dataToSend);
    setSaveWork(false);
    localStorage.removeItem("flattenedData");
    setFlattenedData([]);
    navigate(-1);
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

  useEffect(() => {
    if (!loading && testers.length > 0 && !selectedTester) {
      setSelectedTester(testers[0]);
    }
  }, [testers]);
  // Charger les données depuis localStorage au montage du composant

  const navigationType = useNavigationType();

  useEffect(() => {
    console.log(
      "Page rechargée, effacement des données",
      navigationType,
      !fromScopeModification,
      !viewOnly
    );

    if (
      (navigationType === "PUSH" && !fromScopeModification && !viewOnly) ||
      navigationType === "POP"
    ) {
      console.log("jexecute");
      setFlattenedData([]);
    }
  }, [navigationType]);

  useEffect(() => {
    if (!fromScopeModification && !viewOnly) {
      console.log("je recupere les sonnees de local storage ");
      const savedData = localStorage.getItem("flattenedData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("je mets a jour car saved data est pas vide");
        setFlattenedData(parsedData); // Mettre à jour flattenedData avec les données sauvegardées
        console.log("savedData", parsedData); // Vérifier les données chargées
      }
    }
  }, []);

  // Mettre à jour flattenedData lorsque data change
  useEffect(() => {
    // if (!fromScopeModification && !viewOnly) {
    if (data) {
      const transformedData = transformData(data);
      console.log("mm", transformedData);
      console.log("je met a jour flattened data  lorsqu data change ", data);
      // Utiliser une fonction de mise à jour pour éviter les dépendances cycliques

      let mergedData = [];

      setFlattenedData((prevFlattenedData) => {
        console.log("prev flattened data dans le if", prevFlattenedData);

        // if ( viewOnly === true) {
        //   //alert("je suis dans le if")
          mergedData = mergeData(transformedData, prevFlattenedData);
          // if (fromScopeModification===true) {
          //   mergedData = mergeData(prevFlattenedData, prevFlattenedData);

          // }
        // } else{
        //   mergedData = mergeData(transformedData, prevFlattenedData);

        // }

        console.log("mergedData", mergedData); // Vérifier les données fusionnées
        return mergedData;
      });

      //}
    }
  }, [data]); // Dépend uniquement de data

  // Sauvegarder les données dans localStorage à chaque mise à jour de flattenedData
  useEffect(() => {
    if (fromScopeModification === false && viewOnly === false) {
      //if (flattenedData.length > 0) {
      console.log("je set dans localstorage");
      localStorage.setItem("flattenedData", JSON.stringify(flattenedData));
      //}
    }
  }, [flattenedData]);

  useEffect(() => {
    const fullSelectedRows = flattenedData.filter((row) =>
      selectedControls.includes(row.id)
    );
    setSelectedRows(fullSelectedRows);

    
  }, [selectedControls]);

  const handleFromScopeDelete = async () => {
    // Récupérer les IDs des contrôles sélectionnés
    const idsToDelete = {
      executionsIds: selectedRows.map((row) => row.executionId),
    };
   

    // Appeler la fonction pour supprimer les exécutions
    const undeletableIds = await deleteExecutions(idsToDelete);
    if (undeletableIds.length > 0) {
      // Mettre à jour flattenedData pour ne garder que les exécutions non supprimées
      setFlattenedData((prevData) =>
        prevData.filter(
          (row) =>
            // Garder les lignes qui ne sont pas sélectionnées ou qui n'ont pas été supprimées
            !idsToDelete.includes(row.executionId) ||
            undeletableIds.includes(row.executionId)
        )
      );
      ;
    }
    window.location.reload()

  };

  const handleAtWorkplanDelete = () => {
    console.log("handleAtWorkplanDelete");
    setFlattenedData((prevData) =>
      prevData.filter((row) => !selectedControls.includes(row.id))
    );
  };

  const handleModifyLines = () => {
    // Marquer les lignes sélectionnées comme modifiables
    setFlattenedData((prevData) =>
      prevData.map((row) => {
        if (selectedControls.includes(row.id)) {
          return { ...row, modifiable: true }; // Rendre la ligne modifiable
        }
        return { ...row, modifiable: false }; // Les autres lignes restent non modifiables
      })
    );

    setModify(false);
    console.log("selectedControls for update", selectedControls);
  };

  const handleSaveModifictaion = async () => {
    // Étape 1 : filtrer les lignes modifiables
    const filtered = flattenedData.filter((row) => row.modifiable === true);

    // Étape 2 : ne garder que les champs demandés
    const controlsToUpdate = filtered.map((row) => ({
      id: row.executionId,
      covId: row.covId,
      ...(row.controlModified && {
        controlModification: row.controlDescription,
      }),
      controlOwner: row.controlOwner,
      ...(row.riskModified && {
        riskModification: row.riskDescription,
      }),
      riskOwner: row.riskOwner,
      missionName:JSON.parse(localStorage.getItem("missionData")).missionName ||"non définie",

      controlTester: row.controlTester,
    }));

    // Stocker les lignes extraites dans ton état
    setControlsToUpdate(controlsToUpdate);

    setFlattenedData((prevData) =>
      prevData.map((row) => ({
        ...row,
        modifiable: false,
      }))
    );

    setSelectedRows([]);
    setSelectedControls([]);
    await updateMultipleExecutions(controlsToUpdate);
    localStorage.removeItem("flattenedData");
    setModify(true);
    stopModification();
  };

  const [showExecutionDeleteConfirmation,setShowExecutionDeleteConfirmation]=useState(false)
 const  handleShowDeleteExecutionConfirmation=()=>{
setShowExecutionDeleteConfirmation(true)
  }
  useEffect(() => {
    console.log("flattenedData", flattenedData);
  }, [flattenedData]);
 

//   return (
//     <>
//       <div className="flex  items-center justify-start mb-6"></div>

//       <div
//         className="flex items-center gap-4 justify-end my-5 mr-4 space-x-4"
//         style={{
//           display:
//             user?.role !== "admin" /* || userRole === 'manager'*/
//               ? "flex"
//               : "none",
//         }}
//       >
//         {/* Label */}
//         <label className="text-gray-900 font-semibold">Owner</label>

//         {/* Input Field */}
//         <div className="relative flex items-center bg-white rounded-md border border-gray-300 w-60 px-3 py-2">
//           <User className="text-gray-500 mr-2" size={16} />
//           <input
//             type="text"
//             onChange={(e) => setOwner(e.target.value)}
//             className="bg-transparent outline-none w-full"
//             placeholder="Owner"
//             value={owner}
//           />
//         </div>
//         <div>{editMessage && <p>{editMessage}</p>}</div>

//         {/* Button */}
//         <button
//           onClick={handleUpdateOwner}
//           className="bg-blue-menu text-white px-4 py-2 rounded-md hover:bg-blue-900"
//         >
//           Ajouter
//         </button>

//         <div className="flex items-center  space-x-4">
//           {/* Label */}
//           <label className="text-gray-900 font-semibold">Testeur</label>

//           {/* Dropdown */}
//           <div className="relative z-30 w-60">
//             <div
//               className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-2 cursor-pointer"
//               onClick={() => setIsOpen(!isOpen)}
//             >
//               <User className="text-gray-500 mr-2" size={16} />
//               <span className="flex-1 text-gray-700">
//                 {selectedTester.designation}
//               </span>
//               <ChevronDown className="text-gray-500" size={16} />
//             </div>
//             {isOpen && (
//               <ul className="absolute w-full bg-white border border-gray-300 rounded-md shadow-md mt-1">
//                 {loading ? (
//                   <li className="px-3 py-2">Chargement des testeurs...</li> // Afficher un message de chargement
//                 ) : testers.length > 0 ? (
//                   testers.map((tester) => (
//                     <li
//                       key={tester.id}
//                       className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                       onClick={() => {
//                         setSelectedTester(tester);
//                         handleUpdateTesters(tester);
//                         setIsOpen(false);
//                       }}
//                     >
//                       {tester.designation}
//                     </li>
//                   ))
//                 ) : (
//                   <li className="px-3 py-2">Aucun testeur trouvé</li> // Message si pas de testeurs
//                 )}
//               </ul>
//             )}
//           </div>
//         </div>

//         <div className="   ">
//           {atLeastOneApp && (
//             <button
//               onClick={() => {
//                 setSaveWork(true);
//               }}
//               className="bg-blue-menu text-white px-4 py-2 rounded-md hover:bg-blue-900"
//             >
//               valider
//             </button>
//           )}
//         </div>
//       </div>
//       <div className="flex justify-end mr-4 gap-2">
//       {selectedRows.length > 0 && (
//         <button
//           className="bg-alert-red text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
//           onClick={
//             fromScopeModification
//               ? handleShowDeleteExecutionConfirmation
//               : handleAtWorkplanDelete
//           }
//         >
//           <Trash size={18} />
//           Supprimer
//         </button>
//       )}
//       {fromScopeModification && selectedRows.length > 0 && (
//         <>
//           {modify ? (
//             <button
//               className="bg-blue-conf text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
//               onClick={handleModifyLines}
//             >
//               Modifier
//             </button>
//           ) : (
//             <button
//               className="bg-blue-conf text-white px-4 py-2 rounded-md flex items-center gap-2"
//               onClick={handleSaveModifictaion}
//             >
//               Enregistrer les modifications
//             </button>
//           )}
//         </>
//       )}</div>

//       {saveWork && (
//         <DecisionPopUp
//           handleConfirm={handleSave}
//           handleDeny={() => setSaveWork(false)}
//           name="Confirmation"
//           text="Êtes-vous sûr de vouloir valider les modifications ?"
//           loading={saveloading}
//         />
//       )}
//       {showExecutionDeleteConfirmation && (
//         <DecisionPopUp
//           handleConfirm={handleFromScopeDelete}
//           handleDeny={() => setShowExecutionDeleteConfirmation(false)}
//           name="Confirmation"
//           text="Êtes-vous sûr de vouloir supprimer ces contrôles ? Cette action est irréversible."

//           loading={loading}
//         />
//       )}
//       <div className="m-3">
//         <TableContainer component={Paper} className="overflow-auto ">
//           <Table>
//             <TableHead>
//               <TableRow className="bg-blue-nav">
//                 {/* Application */}
//                 <TableCell
//                   align="center"
//                   style={{ width: 500 }}
//                   className="border border-subfont-gray"
//                 >
//                   Application
//                 </TableCell>

//                 {/* Risques */}
//                 <TableCell
//                   align="center"
//                   style={{ width: 950 }}
//                   className="border border-subfont-gray"
//                 >
//                   Risques
//                 </TableCell>

//                 {/* Contrôles */}
//                 <TableCell
//                   colSpan={6} // 7 colonnes pour Contrôles
//                   align="center"
//                   className="border border-subfont-gray"
//                 >
//                   Contrôles
//                 </TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               <TableRow>
//                 <TableCell colSpan={14} style={{ padding: 0 }}>
//                   <Paper style={{ height: 550, width: "100%" }}>
//                     <DataGrid
//                       sx={{
//                         // Style pour les en-têtes de colonnes
//                         "& .MuiDataGrid-columnHeader": {
//                           backgroundColor: "#E9EFF8", // Couleur de fond verte
//                         },
//                         // Style pour les lignes au survol
//                         "& .MuiDataGrid-row:hover": {
//                           backgroundColor: "#E8F5E9", // Couleur de fond au survol
//                         },
//                       }}
//                       rows={flattenedData}
//                       onRowClick={handleRowClick}
//                       // rows={searchResults}
//                       columns={columns}
//                       pageSize={5}
//                       checkboxSelection={unlockModification}
//                       isCellEditable={(params) => {
//                         console.log(
//                           "fromScopeModification",
//                           fromScopeModification
//                         );

//                         const row = flattenedData.find(
//                           (row) => row.id === params.row.id
//                         );
//                         return row?.modifiable || false;
//                       }}
//                       disableRowSelectionOnClick
//                       onRowSelectionModelChange={(newSelection) => {
//                         setSelectedControls(newSelection);
//                       }}
//                       rowSelectionModel={selectedControls}
//                       rowsPerPageOptions={[5, 10, 20]}
//                       editMode="cell"
//                       onCellEditStop={(params, event) => {
//                         console.log("Edition terminée sur la cellule", params);

//                         const { id, field } = params;
//                         const newValue = event.target.value;

//                         // Mettre à jour le tableau de données avec la nouvelle valeur
//                         setFlattenedData((prevData) => {
//                           const updatedData = prevData.map((row) => {
//                             if (row.id === id) {
//                               console.log("le row est trouvé", field);
//                               row[field] = newValue; // Mettre à jour la cellule
//                               switch (field) {
//                                 case "controlDescription":
//                                   row["controlModified"] = true;
//                                   break;

//                                 case "riskDescription":
//                                   row["riskModified"] = true;
//                                   break;
//                               }
//                             }
//                             return row;
//                           });
//                           return updatedData;
//                         });
//                       }}
//                       //disableSelectionOnClick
//                     />
//                   </Paper>
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </div>
//     </>
//   );
// }

// export default Matrix;

return (
  <>
    <div className="flex  items-center justify-start mb-6"></div>

    <div
      className="flex items-center gap-4 justify-end my-5 mr-4 space-x-4"
      style={{
        display:
          user?.role !== "admin" /* || userRole === 'manager'*/
            ? "flex"
            : "none",
      }}
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
              {loading ? (
                <li className="px-3 py-2">Chargement des testeurs...</li> // Afficher un message de chargement
              ) : testers.length > 0 ? (
                testers.map((tester) => (
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
                ))
              ) : (
                <li className="px-3 py-2">Aucun testeur trouvé</li> // Message si pas de testeurs
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="   ">
        {atLeastOneApp && (
          <button
            onClick={() => {
              setSaveWork(true);
            }}
            className="bg-blue-menu text-white px-4 py-2 rounded-md hover:bg-blue-900"
          >
            valider
          </button>
        )}
      </div>
    </div>
    <div className="flex justify-end mr-4 gap-2">
    {selectedRows.length > 0 && (
      <button
        className="bg-alert-red text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
        onClick={
          fromScopeModification
            ? handleShowDeleteExecutionConfirmation
            : handleAtWorkplanDelete
        }
      >
        <Trash size={18} />
        Supprimer
      </button>
    )}
    {fromScopeModification && selectedRows.length > 0 && (
      <>
        {modify ? (
          <button
            className="bg-blue-conf text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
            onClick={handleModifyLines}
          >
            Modifier
          </button>
        ) : (
          <button
            className="bg-blue-conf text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={handleSaveModifictaion}
          >
            Enregistrer les modifications
          </button>
        )}
      </>
    )}</div>

    {saveWork && (
      <DecisionPopUp
        handleConfirm={handleSave}
        handleDeny={() => setSaveWork(false)}
        name="Confirmation"
        text="Êtes-vous sûr de vouloir valider les modifications ?"
        loading={saveloading}
      />
    )}
    {showExecutionDeleteConfirmation && (
      <DecisionPopUp
        handleConfirm={handleFromScopeDelete}
        handleDeny={() => setShowExecutionDeleteConfirmation(false)}
        name="Confirmation"
        text="Êtes-vous sûr de vouloir supprimer ces contrôles ? Cette action est irréversible."

        loading={loading}
      />
    )}
    <div className="m-3">
      <TableContainer component={Paper} className="overflow-auto ">
        <Table>
          <TableHead>
            <TableRow className="bg-blue-nav">
              {/* Application */}
              <TableCell
                align="center"
                style={{ width: 500 }}
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
                    checkboxSelection={unlockModification}
                    isCellEditable={(params) => {
                      console.log(
                        "fromScopeModification",
                        fromScopeModification
                      );

                      const row = flattenedData.find(
                        (row) => row.id === params.row.id
                      );
                      return row?.modifiable || false;
                    }}
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(newSelection) => {
                      setSelectedControls(newSelection);
                    }}
                    rowSelectionModel={selectedControls}
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
                              case "controlDescription":
                                row["controlModified"] = true;
                                break;

                              case "riskDescription":
                                row["riskModified"] = true;
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