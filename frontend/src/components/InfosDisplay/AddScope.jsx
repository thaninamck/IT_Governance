import React, { useEffect, useState } from 'react';
import { PlusCircle, SquarePen } from 'lucide-react';
import NewAppForm from '../Forms/AppForm';
import Table from '../Table';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DecisionPopUp from '../PopUps/DecisionPopUp';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../Api';
import { useSystem } from '../../Hooks/useSystem';
import { useBreadcrumb } from '../../Context/BreadcrumbContext';

function AddScope({ dataFormat,title, text, text1, onToggleForm, showForm, user, missionId,missionName }) {
  const {
    applications,
    setApplications,
    isDeletePopupOpen,
    setIsDeletePopupOpen,
    selectedAppId,
    selectedApp,
    setSelectedApp,
    showDecisionPopup,
    setShowDecisionPopup,
    isAddingAnother,
    handleAddApp,
    handleDeleteRow,
    confirmDeleteMission,
    handleEditRow,
    handleDecisionResponse
  } = useSystem(missionId, user, showForm, onToggleForm,missionName);

  console.log('applications',applications)
  const { addBreadcrumb } = useBreadcrumb();
  const columnsConfig = [
    { field:'name', headerName: 'Nom', width: 160, editable: true },
    { field: 'description', headerName: 'Description', editable: true, width: 220, expandable: true },
    { field: 'ownerName', headerName: 'Owner', width: 200 },
    { field: 'ownerContact', headerName: 'Contact', width: 200 },
    {
      field: "layers",
      headerName: "Couche",
      width: 200,
      expandable: true,
      customRenderCell: (params) => {
        const layers = Array.isArray(params.value) ? params.value : [];
        const [showAll, setShowAll] = React.useState(false);
        const maxVisible = 3;
    
        if (layers.length === 0) {
          return <span className="text-gray-400">Aucune donnée</span>;
        }
    
        return (
          <div className="flex flex-wrap gap-1 items-center">
            {(showAll ? layers : layers.slice(0, maxVisible)).map((layer, index) => (
              <div
                key={index}
                title={layer.name}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full border border-white shadow"
              >
                {layer.name}
              </div>
            ))}
            
            {!showAll && layers.length > maxVisible && (
              <div className="flex items-center">
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAll(true);
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full cursor-help group"
                  title={layers.slice(maxVisible).map(l => l.name).join(', ')}
                >
                  +{layers.length - maxVisible} more
                  <div className="absolute hidden group-hover:block z-10 bottom-full left-0 mb-2 p-2 bg-white shadow-lg rounded max-w-xs max-h-60 overflow-y-auto">
                    {layers.slice(maxVisible).map((layer, index) => (
                      <div key={index} className="px-2 py-1 text-xs">
                        {layer.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {showAll && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAll(false);
                }}
                className="ml-1 border-none text-xs text-gray-400  hover:text-gray-600"
              >
               ▲ close
              </button>
            )}
          </div>
        );
      }
    },
    // Ajouter la colonne "actions" conditionnellement
    ...((dataFormat?.profileName === 'manager' || user?.role === 'admin')
      ? [{ field: 'actions', headerName: 'Action', width: 70 }]
      : [])
  ];
 
  const rowActions = [
    { icon: <SquarePen className='mr-2' />, label: 'Modifier', onClick: handleEditRow },
    { icon: <DeleteOutlineRoundedIcon sx={{ color: 'var(--alert-red)', marginRight: '5px' }} />, label: 'Supprimer', onClick: handleDeleteRow }
  ];


  const navigate = useNavigate(); // Hook pour la navigation
  const handleRowClick = (rowData) => {
    navigate(`/missions/${missionName}/${rowData.name}`, { state: {appId: rowData.id, AppData: rowData } });
    console.log('Détails du app sélectionné:', rowData);

    addBreadcrumb(rowData?.name, `/missions/${missionName}/${rowData.name}`, 
      { appId: rowData.id, AppData: rowData });
    console.log('appId:', rowData.id);
  };


  return (
    <div className="p-4 mb-1">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="text-[var(--blue-menu)] w-5 h-5" />
        <h2 className="text-l font-semibold text-[var(--blue-menu)]">{title}</h2>
        <hr className="flex-grow border-t border-[var(--blue-menu)]" />
      </div>

      {(dataFormat?.profileName === 'manager'  || user?.role=== 'admin') &&
        <div className="flex flex-row items-center gap-4 pl-6">
          <p className="text-[var(--status-gray)] text-s">{applications.length > 0 ? text1 : text}</p>
          <button
            onClick={onToggleForm}
            className="px-4 py-2 border-none bg-[var(--blue-menu)] text-white text-sm font-medium rounded"
          >
            Ajouter
          </button>
        </div>}

      {showDecisionPopup && (
        <div className="absolute top-25 left-1/2 -translate-x-1/2 translate-y-1/4 z-50 ">
          <DecisionPopUp
            name="nouvelle application"
            text="Voulez-vous ajouter une autre application ?"
            handleConfirm={() => handleDecisionResponse(true)}
            handleDeny={() => handleDecisionResponse(false)}
          />
        </div>
       )}

      {(showForm || isAddingAnother) && (
        <NewAppForm title={''} 
        initialValues={selectedApp || {}}
         onAddApp={handleAddApp} 
        //  onClose={() => setShowDecisionPopup(false)} 
        onClose={() => {
          onToggleForm(); // Ferme le formulaire via la fonction parente
          setSelectedApp(null);
        }} 
         />
      )}


      {isDeletePopupOpen && (
        <div className="absolute top-100 left-1/2 -translate-x-1/2 z-50 mt-9">
          <DecisionPopUp
            name={applications.find((row) => row.id === selectedAppId)?.name|| 'cette Application'}
            text="Êtes-vous sûr(e) de vouloir supprimer l'application "
            handleConfirm={confirmDeleteMission}
            handleDeny={() => setIsDeletePopupOpen(false)}
          />
        </div>
      )}

      {applications.length > 0 && (
        <div className={`mt-6 flex-1  flex justify-center  overflow-x-auto overflow-y-auto h-[350px] transition-all ${isDeletePopupOpen ? 'blur-sm' : ''}`}>
          <Table
            key={JSON.stringify(applications)}
            columnsConfig={columnsConfig}
            rowsData={applications}
            checkboxSelection={false}
            onRowClick={handleRowClick}
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
