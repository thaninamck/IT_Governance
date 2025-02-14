import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Checkbox } from '@mui/material';

const rows = [
  { 
    id: 1, application: 'USSD', applicationLayer: 'OS', applicationOwner: 'rezazi', 
    riskCode: 'FTRM', riskName: 'SEC log', riskDescription: 'Security log risk', riskOwner: 'John Doe',
    controlCode: 'PCS214', controlDescription: 'Supportability', majorProcess: 'Technical', 
    subProcess: 'Access control', testScript: 'Verify logs', controlOwner: 'Jane Smith', controlTester: 'Testeur'
  },
  { 
    id: 2, application: 'USSD', applicationLayer: 'APP', applicationOwner: 'rezazi', 
    riskCode: 'FTRM', riskName: 'SEC log', riskDescription: 'Security log risk', riskOwner: 'John Doe',
    controlCode: 'PCS215', controlDescription: 'Audit Logs', majorProcess: 'Technical', 
    subProcess: 'Access control', testScript: 'Check audit logs', controlOwner: 'Jane Smith', controlTester: 'Testeur'
  },
];

function Matrix() {
  const [selectedRisk, setSelectedRisk] = useState({});
  const [selectedControl, setSelectedControl] = useState({});

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

  const columns = [
    // Application
    { field: 'application', headerName: 'Application', width: 150, editable: true },
    { field: 'applicationLayer', headerName: 'Layer', width: 150, editable: true },
    { field: 'applicationOwner', headerName: 'Owner', width: 150, editable: true },

    // Risques
    {
      field: 'riskCheckbox',
      headerName: 'Select Risk',
      width: 150,
      renderCell: (params) => (
        <Checkbox
          checked={!!selectedRisk[params.row.id]}
          onChange={handleRiskCheckboxChange(params.row.id)}
        />
      ),
    },
    { field: 'riskCode', headerName: 'Risk Code', width: 150, editable: true },
    { field: 'riskName', headerName: 'Risk Name', width: 150, editable: true },
    { field: 'riskDescription', headerName: 'Risk Description', width: 200, editable: true },
    { field: 'riskOwner', headerName: 'Risk Owner', width: 150, editable: true },
   

    // Contrôles
    {
      field: 'controlCheckbox',
      headerName: 'Select Control',
      width: 150,
      renderCell: (params) => (
        <Checkbox
          checked={!!selectedControl[params.row.id]}
          onChange={handleControlCheckboxChange(params.row.id)}
        />
      ),
    },
    { field: 'controlCode', headerName: 'Control Code', width: 150, editable: true },
    { field: 'controlDescription', headerName: 'Control Description', width: 200, editable: true },
    { field: 'majorProcess', headerName: 'Major Process', width: 150, editable: true },
    { field: 'subProcess', headerName: 'Sub Process', width: 150, editable: true },
    { field: 'testScript', headerName: 'Test Script', width: 150, editable: true },
    { field: 'controlOwner', headerName: 'Control Owner', width: 150, editable: true },
    { field: 'controlTester', headerName: 'Control Tester', width: 150, editable: true },
    
  ];

  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        editMode='cell'
        disableSelectionOnClick
      />
    </Paper>
  );
}

export default Matrix;