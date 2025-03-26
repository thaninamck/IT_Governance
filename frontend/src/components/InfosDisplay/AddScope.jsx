import React, { useEffect, useState } from 'react';
import { PlusCircle, SquarePen } from 'lucide-react';
import NewAppForm from '../Forms/AppForm';
import Table from '../Table';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DecisionPopUp from '../PopUps/DecisionPopUp';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../Api';
import { useSystem } from '../../Hooks/useSystem';

function AddScope({ title, text, text1, onToggleForm, showForm, userRole, missionId }) {
  const {
    applications,
    setApplications,
    isDeletePopupOpen,
    setIsDeletePopupOpen,
    selectedAppId,
    selectedApp,
    setSelectedApp,
    showDecisionPopup,
    isAddingAnother,
    handleAddApp,
    handleDeleteRow,
    confirmDeleteMission,
    handleEditRow,
    handleDecisionResponse
  } = useSystem(missionId, userRole, showForm, onToggleForm);

  const columnsConfig = [
    { field: 'name', headerName: 'Nom', width: 170, editable: true },
    { field: 'description', headerName: 'Description', editable: true, width: 220, expandable: true },
    { field: 'ownerName', headerName: 'Owner', width: 170 },
    { field: 'ownerContact', headerName: 'Contact', width: 200 },
    {
      field: "couche",
      headerName: "Couche",
      width: 200,
      expandable: true,
      customRenderCell: (params) => {
        console.log("Couche value:", params.value); // Debugging line

        const coucheValues = Array.isArray(params.value) ? params.value : [];


        return (
          <div className="flex -space-x-2">
            {coucheValues.length > 0 ? (
              coucheValues.map((item, index) => {
                const words = String(item).split(" ");
                const initials = words.length > 1
                  ? words.map((word) => word[0]).join("").toUpperCase()
                  : String(item).substring(0, 3).toUpperCase();
                return (
                  <div
                    key={index}
                    title={item}
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
        );
      }
    },
    // Ajouter la colonne "actions" conditionnellement
    ...((userRole === 'manager' || userRole === 'admin')
      ? [{ field: 'actions', headerName: 'Action', width: 80 }]
      : [])
  ];
 
  const rowActions = [
    { icon: <SquarePen className='mr-2' />, label: 'Modifier', onClick: handleEditRow },
    { icon: <DeleteOutlineRoundedIcon sx={{ color: 'var(--alert-red)', marginRight: '5px' }} />, label: 'Supprimer', onClick: handleDeleteRow }
  ];


  const navigate = useNavigate(); // Hook pour la navigation
  const handleRowClick = (rowData) => {
    // Naviguer vers la page de détails avec l'ID du contrôle dans l'URL
    navigate(`/missions/${missionId}/${rowData.nomApp}`, { state: { AppData: rowData } });
    console.log('Détails du app sélectionné:', rowData);
  };


  return (
    <div className="p-4 mb-1">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="text-[var(--blue-menu)] w-5 h-5" />
        <h2 className="text-l font-semibold text-[var(--blue-menu)]">{title}</h2>
        <hr className="flex-grow border-t border-[var(--blue-menu)]" />
      </div>

      {(userRole === 'manager' || userRole === 'admin') &&
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
        <NewAppForm title={''} initialValues={selectedApp || {}} onAddApp={handleAddApp} onClose={() => setShowDecisionPopup(false)} />
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
        <div className={`mt-6 flex-1 overflow-x-auto overflow-y-auto h-[400px] transition-all ${isDeletePopupOpen ? 'blur-sm' : ''}`}>
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
