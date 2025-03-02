import React from "react";
import Table from "../components/Table";

const AdminActionsPanel = ({ pendingActions, onValidateAction, onRejectAction }) => {
  // Log pour vérifier la structure des pendingActions
  console.log("Pending Actions:", pendingActions);

  // Configuration des colonnes pour le tableau
  const columnsConfig = [
    { field: "type", headerName: "Type d'action", width: 150 },
    { field: "client", headerName: "Client", width: 150 },
    { field: "mission", headerName: "Mission", width: 150 },
    { field: "requestedBy", headerName: "Demandé par", width: 150 },
    {
      field: "timestamp",
      headerName: "Date de la demande",
      width: 200,
      customRenderCell: (params) => {
        return new Date(params.row.timestamp).toLocaleString();
      },
    },
    {
      field: "decision",
      headerName: "Actions",
      width: 250,
      customRenderCell: (params) => {
        // Log pour vérifier les données passées aux boutons
        console.log("Action passée aux boutons:", params.row);

        return (
          <div className="flex items-center justify-center gap-4 w-full">
            <button
              className="px-4 flex items-center h-[40px] border-none bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 focus:outline-none"
              onClick={() => onValidateAction(params.row)}
            >
              Valider
            </button>
            <button
              className="px-4 flex items-center h-[40px] border-none bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 focus:outline-none"
              onClick={() => onRejectAction(params.row)}
            >
              Rejeter
            </button>
          </div>
        );
      },
    },
  ];

  // Transformer les données pour correspondre au format attendu par le tableau
  const rowsData = pendingActions
    .filter((action) => action && action.row && action.row.id) // Filtre les actions valides
    .map((action) => {
      // Log pour vérifier chaque action transformée
      console.log("Action transformée:", action);

      return {
        id: action.row.id,
        type: action.type,
        client: action.row.client,
        mission: action.row.mission,
        requestedBy: action.requestedBy,
        timestamp: action.timestamp,
      };
    });

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold  text-gray-800">Demandes de validation en attente</h2>
      {pendingActions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6">
          <p className="text-gray-500">Aucune demande en attente.</p>
         
        </div>
      ) : (
        <Table
          key={JSON.stringify(rowsData)}
          columnsConfig={columnsConfig}
          rowsData={rowsData}
          checkboxSelection={false}
          headerTextBackground={"white"}
          headerBackground="var(--blue-menu)"
        />
      )}
    </div>
  );
};

export default AdminActionsPanel;