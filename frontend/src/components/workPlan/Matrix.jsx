import React, { useState } from "react";
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

function Matrix() {
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
              <Paper style={{ height: 400, width: "100%" }}>
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
                  rows={rows}
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
