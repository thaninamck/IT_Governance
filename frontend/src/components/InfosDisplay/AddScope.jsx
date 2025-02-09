import React, { useState } from 'react';
import { PlusCircle, SquarePen } from 'lucide-react';
import NewAppForm from '../Forms/AppForm';
import Table from '../Table';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DecisionPopUp from '../PopUps/DecisionPopUp';

function AddScope({ title, text, text1, onToggleForm, showForm }) {
  const [applications, setApplications] = useState([]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);

  // Configuration des colonnes pour le composant Table
  const columnsConfig = [
    { field: 'nomApp', headerName: 'Nom', width: 170, editable: true },
    { field: 'description', headerName: 'Description', editable: true, width: 220 },
    { field: 'owner', headerName: 'Owner', width: 170 },
    { field: 'contact', headerName: 'Contact', width: 200 },
    { field: 'couche', headerName: 'Couche', width: 200 },
    { field: 'actions', headerName: 'Action', width: 80 },
  ];

  // Ajouter une application
  const handleAddApp = (app) => {
    setApplications((prev) => [...prev, { id: prev.length + 1, ...app }]);
  };

  // Supprimer une application
  const handleDeleteRow = (rowId) => {
    setSelectedAppId(rowId);
    setIsDeletePopupOpen(true);
  };

  const confirmDeleteMission = () => {
    if (selectedAppId !== null) {
      setApplications((prev) => prev.filter((row) => row.id !== selectedAppId));
    }
    setIsDeletePopupOpen(false);
    setSelectedAppId(null);
  };

  // Actions pour chaque ligne
  const rowActions = [
    { icon: <SquarePen className='mr-2' />, label: 'Modifier', onClick: handleDeleteRow },
    { icon: <DeleteOutlineRoundedIcon sx={{ color: 'var(--alert-red)', marginRight: '5px' }} />, label: 'Supprimer mission', onClick: handleDeleteRow },
  ];

  return (
    <div className="p-4 mb-6">
      {/* Titre avec icône */}
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="text-[var(--blue-menu)] w-5 h-5" />
        <h2 className="text-l font-semibold text-[var(--blue-menu)]">{title}</h2>
        <hr className="flex-grow border-t border-[var(--blue-menu)]" />
      </div>

      <div className="flex flex-row items-center gap-4 pl-6">
        <p className="text-[var(--status-gray)] text-s">{applications.length > 0 ? text1 : text}</p>
        <button
          onClick={onToggleForm}
          className="px-4 py-2 border-none bg-[var(--blue-menu)] text-white text-sm font-medium rounded"
        >
          Ajouter
        </button>
      </div>

      {showForm && <NewAppForm title="Nouvelle Application" onAddApp={handleAddApp} />}

      {isDeletePopupOpen && (
        <div className="absolute top-100 left-1/2  -translate-x-1/2 z-50  border border-black w-[600px]">
          <DecisionPopUp
            name={applications.find((row) => row.id === selectedAppId)?.nomApp || 'cette Application'}
            text="Êtes-vous sûr(e) de vouloir supprimer l'application "
            handleConfirm={confirmDeleteMission}
            handleDeny={() => setIsDeletePopupOpen(false)}
          />
        </div>
      )}
      {/* Afficher le tableau seulement s'il y a des applications */}
      {applications.length > 0 && (
        <div className={`mt-6   flex-1 overflow-x-auto overflow-y-auto h-[400px] transition-all ${isDeletePopupOpen ? 'blur-sm' : ''}`}>
          
          <Table
          key={applications.length}
            columnsConfig={columnsConfig}
            rowsData={applications}
            checkboxSelection={false}
            headerBackground="var(--blue-nav)"
            rowActions={rowActions}
            onCellEditCommit={(params) => {
              setApplications((prev) =>
                prev.map((row) =>
                  row.id === params.id ? { ...row, [params.field]: params.value } : row
                )
              );
            }}
          />
           
        </div>
        
      )}


    </div>
  );
}

export default AddScope;
