import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { User, ChevronDown } from "lucide-react";

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

function Matrix({ data }) {
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

  const [flattenedData, setFlattenedData] = useState([]);
  const transformData = (data) => {
    const result = [];

    data.applications.forEach((app) => {
      const appName = app.description;
      const appOwner = app.owner;

      app.layers.forEach((layer) => {
        const layerName = layer.name;

        layer.risks.forEach((risk) => {
          const riskCode = risk.id;
          const riskName = risk.nom;
          const riskDescription = risk.description;
          const riskOwner = risk.owner;

          risk.controls.forEach((control) => {
            result.push({
              id: `${app.id}-${layer.id}-${risk.id}-${control.id}`,
              application: appName,
              applicationLayer: layerName,
              applicationOwner: appOwner,
              riskCode: riskCode,
              riskName: riskName,
              riskDescription: riskDescription,
              riskOwner: riskOwner,
              controlCode: control.id,
              controlDescription: control.description,
              majorProcess: control.majorProcess,
              subProcess: control.subProcess,
              testScript: control.testScript,
              controlOwner: control.owner,
              controlTester: "",
            });
          });
        });
      });
    });

    return result;
  };

  // Utilisation dans le useEffect
  useEffect(() => {
    const transformedData = transformData(data);
    setFlattenedData(transformedData);
  }, [data]);

  const [selectedRisk, setSelectedRisk] = useState({});
  const [selectedApp, setSelectedApp] = useState({});

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
        // Si l'élément est de type "app", on met à jour la cellule correspondante
        if (type === "app") {
          rows[rowIndex].applicationOwner = ownername; // Remplace par le nom réel
        }
        // Si l'élément est de type "risk", on met à jour la cellule correspondante
        if (type === "risk") {
          rows[rowIndex].riskOwner = ownername; // Remplace par le nom réel
        }
        // Si l'élément est de type "control", on met à jour la cellule correspondante
        if (type === "control") {
          rows[rowIndex].controlOwner = ownername; // Remplace par le nom réel
        }
      }
    });

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

  // Gestion des cases à cocher pour les applications
  const handleAppCheckboxChange = (id) => (event) => {
    const type = "app";
    setSelectedItems((prev) => {
      if (event.target.checked) {
        // Si la case est cochée, on ajoute l'objet { id, type }
        return [...prev, { id, type }];
      } else {
        // Si la case est décochée, on retire l'objet { id, type }
        return prev.filter((item) => item.id !== id || item.type !== type);
      }
    });
    console.log("id slcted", id);
    setSelectedApp((prev) => ({
      ...prev,
      [id]: event.target.checked,
    }));
  };

  // Gestion des sélections pour les testeurs
  const handleTesterChange = (id) => (event) => {
    setTesterValues((prev) => ({
      ...prev,
      [id]: event.target.value, // Stocke l'ID du testeur sélectionné
    }));
  };

  const columns = [
    // Application
    {
      field: "appCheckbox",
      headerName: "Select app",
      width: 150,
      renderCell: (params) => (
        <Checkbox
          className="appCheckbox"
          checked={!!selectedApp[params.row.id]}
          onChange={handleAppCheckboxChange(
            params.row.id,
            params.row.applicationOwner
          )}
        />
      ),
    },
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
      editable: true,
    },
    {
      field: "applicationOwner",
      headerName: "Owner",
      width: 150,
      editable: true,
    },

    // Risques
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
    { field: "riskCode", headerName: "Risk Code", width: 150, editable: true },
    { field: "riskName", headerName: "Risk Name", width: 150, editable: true },
    {
      field: "riskDescription",
      headerName: "Risk Description",
      width: 200,
      editable: true,
    },
    {
      field: "riskOwner",
      headerName: "Risk Owner",
      width: 150,
      editable: true,
    },

    // Contrôles
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
    {
      field: "controlCode",
      headerName: "Control Code",
      width: 150,
      editable: true,
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
      editable: true,
    },
    {
      field: "subProcess",
      headerName: "Sub Process",
      width: 150,
      editable: true,
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
      editable: true,
    },
    {
      field: "controlTester",
      headerName: "Testeur",
      width: 150,
      renderCell: (params) => (
        <Select
          value={testerValues[params.row.id] || params.row.controlTester} // Utilise l'ID du testeur
          onChange={handleTesterChange(params.row.id)}
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

  return (
    <>
      <div className="flex items-center justify-end my-5 ml-2 space-x-4">
        {/* Label */}
        <label className="text-gray-900 font-semibold">Owner</label>

        {/* Input Field */}
        <div className="relative flex items-center bg-gray-100 rounded-md border border-gray-300 w-60 px-3 py-2">
          <User className="text-gray-500 mr-2" size={16} />
          <input
            type="text"
            onChange={(e) => setOwner(e.target.value)}
            className="bg-transparent outline-none w-full"
            placeholder="Owner"
            value={owner}
          />
        </div>

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
              className="flex items-center bg-gray-100 rounded-md border border-gray-300 px-3 py-2 cursor-pointer"
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
      </div>

      <TableContainer component={Paper} className="overflow-auto">
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
                style={{ width: 800 }}
                className="border border-subfont-gray"
              >
                Risques
              </TableCell>

              {/* Contrôles */}
              <TableCell
                colSpan={7} // 7 colonnes pour Contrôles
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
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                  />
                </Paper>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Matrix;
