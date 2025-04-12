import React from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import Separator from '../../components/Decorators/Separator';
import SelectInput from '../../components/Forms/SelectInput';
import EditableTextarea from '../../components/EditableInput';
import Remediation from '../../components/Forms/Remediation';
import Table from '../../components/Table';
import DecisionPopUp from '../../components/PopUps/DecisionPopUp';
import useExecution from '../../Hooks/useExecution';
function ConclusionRemediationSection({
  selectedMulti,
  setSelectedMulti,
  shouldShowRemediation,
  commentaire,
  setCommentaire,
  action,
  handleSubmit,
  handleAdd,
  handleValidate,
  statusOptions,
  statusColors,
  columnsConfig,
  isValidateDisabled,
  showRemediation,
  setShowRemediation,
  handleRowClick,
  rowActions,
  isDeletePopupOpen,
  confirmDeleteMission,
  setIsDeletePopupOpen,
  selectedActionId,
  showDecisionPopup ,
  handleDecisionResponse,
  isAddingAnother,
  controleID,
  onClose,
}) {

  const {options }=useExecution();
  const statuses = options.map((status) => ({
    label: status.status_name,  
    value: status.id            
  }));
  
  const fallbackStatuses = [
    { label: "Aucun status trouvé pour le moment ", value: 0 },
    
  ]
  
  return (
    <div>
      <div className='mr-5'>
      <Separator text={'Conclusion'}  />

      </div>
      <div className='flex flex-row items-center gap-14 py-7 ml-5'>
        <label className="mr-8 font-medium">Status</label>
        <SelectInput
          label=""
          options={statuses.length > 0 ? statuses : fallbackStatuses}
                    value={selectedMulti}
          onChange={(e) => setSelectedMulti(e.target.value)}
          width="200px"
          multiSelect={false}
          mt="mt-10"
        />

        {shouldShowRemediation && (
          <div className='flex flex-row items-center gap-1'>
            <ErrorOutlineIcon sx={{ color: 'var(--await-orange)' }} />
            <span className='text-[var(--await-orange)]'>Vous devriez compléter la section remédiation</span>
          </div>
        )}
      </div>

      <div className="flex flex-row items-center py-3 ml-5 ">
        <label className="mr-8 font-medium">Commentaire</label>
        <EditableTextarea
          placeholder="Saisir un commentaire ..."
          onSave={(newComment) => setCommentaire(newComment)}
        />
      </div>
      <p className="mt-4 text-gray-600">Commentaire actuel : {commentaire}</p>

      <div className="flex justify-end m-3 py-6 gap-5">
       
          <button
            onClick={() => setShowRemediation((prevState) => !prevState)}
            className='text-[var(--blue-menu)] px-3 py-2 border-[var(--blue-menu)]'
          >
            Créer une remédiation <AddCircleOutlineRoundedIcon />
          </button>
      
        {action.length === 0 && (
          <button
            className={`bg-[var(--blue-menu)] text-white px-4 py-2 ${isValidateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isValidateDisabled}
            onClick={handleSubmit}
          >
            Valider
          </button>
        )}
      </div>
      {showDecisionPopup && (
        <div className="absolute top-25 left-1/2 -translate-x-1/2 translate-y-1/4 z-50 ">
          <DecisionPopUp
            name="nouvelle action"
            text="Voulez-vous ajouter une autre action ?"
            handleConfirm={() => handleDecisionResponse(true)}
            handleDeny={() => handleDecisionResponse(false)}
          />
        </div>
      )}

      {(showRemediation|| isAddingAnother) && (
        <Remediation title={'Créer une remédiation'} initialValues={selectedActionId || {}} onAdd={handleAdd} idControle={controleID} onClose={onClose}/>)}

      {/* Table for Remédiations */}
      {action.length > 0 && (
        
        <>
              <div className='mr-5'>

          <Separator text={'Remédiation'} />
         </div>
          <div className={`mt-6 flex-1 overflow-x-auto overflow-y-auto h-[400px] transition-all }`}>

          {isDeletePopupOpen && (
        <div className="absolute top-50 left-1/2 -translate-x-1/2 z-50 mt-6">
          <DecisionPopUp
            name={action.find((row) => row.id === selectedActionId)?.id || 'cette Action'}
            text="Êtes-vous sûr(e) de vouloir supprimer l'action "
            handleConfirm={confirmDeleteMission}
            handleDeny={() => setIsDeletePopupOpen(false)}
          />
        </div>
      )}
            <Table
              key={JSON.stringify(action)}
              columnsConfig={columnsConfig}
              rowsData={action}
              checkboxSelection={false}
              onRowClick={handleRowClick}
              rowActions={rowActions}
              headerBackground="var(--blue-nav)"
              statusOptions={statusOptions}
              statusColors={statusColors}
              onCellEditCommit={(params) => {
                handleAdd(params);
              }}
            />
           
          </div>
          {action.length > 0 && (
            <div className="flex justify-end mt-5">
              <button
                className={`bg-[var(--blue-menu)] text-white px-4 py-2 ${isValidateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isValidateDisabled}
                onClick={handleSubmit}
              >
                Valider
              </button>
            </div>
          )}



        </>
      )}
    </div>
  );
}

export default ConclusionRemediationSection;
