import React, { useState,useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Select, MenuItem, Checkbox, TextField } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function Matrix({data}) {


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
              description: "furfuzirfyzuf iuzyfoz ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof",
              owner: "",
              controls: [
                {
                  id: "4",
                  description: "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification...",
                  majorProcess: "Technical",
                  subProcess: "Access control",
                  testScript: "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
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
            applicationOwner: appOwner ,
            riskCode: riskCode,
            riskName: riskName,
            riskDescription: riskDescription,
            riskOwner: riskOwner ,
            controlCode: control.id,
            controlDescription: control.description,
            majorProcess: control.majorProcess,
            subProcess: control.subProcess,
            testScript: control.testScript,
            controlOwner: control.owner ,
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

  // Gestion des cases à cocher pour les risques
  const handleRiskCheckboxChange = (id) => (event) => {
    setSelectedRisk((prev) => ({
      ...prev,
      [id]: event.target.checked,
    }));
  };

  // Gestion des cases à cocher pour les contrôles
  const handleControlCheckboxChange = (id) => (event) => {
    setSelectedControl((prev) => ({
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
                  "& .MuiDataGrid-columnHeader":  {
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
                  checkboxSelection
                  disableSelectionOnClick
                />
              </Paper>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Matrix;
