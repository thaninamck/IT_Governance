import React, { useState } from 'react';
import { PlusCircle, SquarePen } from 'lucide-react';
import NewAppForm from '../Forms/AppForm';
import Table from '../Table';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DecisionPopUp from '../PopUps/DecisionPopUp';

function AddScope({ title, text, text1, onToggleForm, showForm }) {
  const [applications, setApplications] = useState([
    {id:1,nomApp:"USSD",description:'llllll',owner:'farid akbi',contact:'farid@gmail.com',couche:["Data Base","Application"]},
    {id:2,nomApp:"New SNOC",description:'llllll',owner:'farid akbi',contact:'farid@gmail.com',couche:['Data Base']},
    {id:3,nomApp:"CSV360°",description:'llllll',owner:'farid akbi',contact:'farid@gmail.com',couche:['Data Base','Application']}
  
  ]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      
      

  // Configuration des colonnes pour le composant Table
  const columnsConfig = [
    { field: 'nomApp', headerName: 'Nom', width: 170, editable: true },
    { field: 'description', headerName: 'Description', editable: true, width: 220 },
    { field: 'owner', headerName: 'Owner', width: 170 },
    { field: 'contact', headerName: 'Contact', width: 200 },
    {
      field: "couche",
      headerName: "Couche",
      width: 200,
      expandable: true,
      customRenderCell: (params) => (
        <div className="flex -space-x-2">
          {Array.isArray(params.value) ? (
            params.value.map((item, index) => {
              const words = item.split(" ");
              const initials = words.length > 1
                ? words.map((word) => word[0]).join("").toUpperCase()
                : item.substring(0, 3).toUpperCase();
      
              return (
                <div
                  key={index}
                  title={item} // Affiche le nom complet au survol
                  className="w-11 h-11 flex items-center justify-center text-xs bg-blue-100 text-blue-600 rounded-full border border-white shadow cursor-pointer"
                >
                  {initials}
                </div>
              );
            })
          ) : (
            <span className="text-gray-400">Aucune donnée</span>
          )}
        </div>
      )
      
    },
    
    
    { field: 'actions', headerName: 'Action', width: 80 },
  ];

  // Ajouter une application
  // Ajouter une application
  const handleAddApp = (app) => {
    if (selectedApp) {
      // Mise à jour d'une application existante
      setApplications((prevApps) =>
        prevApps.map(row => (row.id === app.id ? app : row))
      );
    } else {
      // Ajout d'une nouvelle application
      setApplications((prev) => [
        ...prev,
        { id: prev.length + 1, ...app, couche: Array.isArray(app.couche) ? app.couche : [app.couche] }
      ]);
    }
    setSelectedApp(null);
    onToggleForm(); // Fermer le formulaire après l'ajout ou la modification
  };

  

  // Supprimer une application
  const handleDeleteRow = (selectedRow) => {
    setSelectedAppId(selectedRow.id);
    setIsDeletePopupOpen(true);
    console.log(selectedRow)
  };

  const confirmDeleteMission = () => {
    if (selectedAppId !== null) {
      setApplications((prev) => prev.filter((row) => row.id !== selectedAppId));
    }
    setIsDeletePopupOpen(false);
    setSelectedAppId(null);
  };

  // Modification d'une mission
  const handleEditRow = (selectedRow) => {
    setSelectedApp(selectedRow);
    if (!showForm) onToggleForm(); // Ouvrir le formulaire si ce n'est pas déjà le cas
  };
  

 // Mise à jour des missions après modification
//  const handleUpdateApp = (updatedApp) => {
//   setApplications(prevApps =>
//     prevApps.map(row => 
//       row.id === updatedApp.id ? { ...updatedApp, couche: Array.isArray(updatedApp.couche) ? updatedApp.couche : [updatedApp.couche] } : row
//     )
//   );
//   setIsEditModalOpen(false);
//   setSelectedApp(null);
// };


  // Actions pour chaque ligne
  const rowActions = [
    { icon: <SquarePen className='mr-2' />, label: 'Modifier', onClick:(selectedRow)=>{handleEditRow(selectedRow)}},
    { icon: <DeleteOutlineRoundedIcon sx={{ color: 'var(--alert-red)', marginRight: '5px' }} />, label: 'Supprimer mission', onClick:(selectedRow)=>{handleDeleteRow(selectedRow)} },
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

      {showForm && <NewAppForm title={''} initialValues={selectedApp || {}} onAddApp={handleAddApp} />}


      {isDeletePopupOpen && (
        <div className="absolute top-100 left-1/2  -translate-x-1/2 z-50  mt-9">
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
          {console.log("Applications:", applications)
          }
          <Table
         key={JSON.stringify(applications)}
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
