import React from 'react'
import Table from '../../components/Table';
import { useNavigate } from 'react-router-dom';

function ListControle() {

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
          id: 6,
          code: "PIS.2234a",
          description: "User access rights are removed on termination of employment or contract, or adjusted (starters, leavers, movers) upon change of role.",
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
          "1. Obtain the access management policy, 2. Obtain HR list of departures during the audited period 3. Obtain the 3rd party list of leavers during the audited period,4. Obtain the list of active AD user accounts,5. Obtain HR list of departures during the audited period," },
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
      
      const navigate = useNavigate();

  const handleRowClick = (rowData) => {
    // Naviguer vers la page de détails avec l'ID du contrôle dans l'URL
    navigate(`/controle/${rowData.code}`, { state: { controleData: rowData }} );
   // navigate('/controle', { state: { controleData: rowData } });
    console.log('Détails du contrôle sélectionné:', rowData);
  };
    
  return (
    <div className='flex items-center justify-center mt-80'>
        <Table
                      columnsConfig={controlColumnsConfig}
                      rowsData={controlsData}
                      checkboxSelection={false}
                      onRowClick={handleRowClick}
                      allterRowcolors={true}
                      className="w-full"
                    />
    </div>
  )
}

export default ListControle