import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import Separator from "../../components/Decorators/Separator";
import SelectInput from "../../components/Forms/SelectInput";
import EditableTextarea from "../../components/EditableInput";
import Remediation from "../../components/Forms/Remediation";
import Table from "../../components/Table";
import DecisionPopUp from "../../components/PopUps/DecisionPopUp";
import useExecution from "../../Hooks/useExecution";
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
  showDecisionPopup,
  handleDecisionResponse,
  isAddingAnother,
  controleID,
  onClose,
  handleSaveModifications,
  loading,
  isToReview,
  isToValidate,
  handleCloseForm,

}) {
  const { options } = useExecution();
  
  const statuses = options.map((status) => ({
    label: status.status_name,
    value: status.id,
  }));

  const fallbackStatuses = [
    { label: "Aucun statut trouvé pour le moment ", value: 0 },
  ];

  const showSave = !(isToReview || isToValidate);

  return (
    <div>
      <div className="min-h-screen">
        <div className="mr-5 ml-8">
          <Separator text={"Conclusion"} />
        </div>
        <div className="flex flex-row items-center gap-4 py-7 ml-9">
          <label className="mr-20 ml-8 font-medium">Statut</label>
          {/* <label className="mr-20 ml-8 font-medium">{selectedMulti}</label> */}
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
            <div className="flex flex-row items-center gap-1">
              <ErrorOutlineIcon sx={{ color: "var(--await-orange)" }} />
              <span className="text-[var(--await-orange)]">
                Vous devriez compléter la section remédiation
              </span>
            </div>

          )}
        </div>

        {/* <div className="flex items-start gap-16 ml-9">
      <label className=" ml-8 font-medium">Commentaire :</label>
      <textarea
  className="w-[76%] min-h-[40px] border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
  value={commentaire}
  readOnly
/>
    </div> */}

        <div className="flex flex-row gap-10 items-center mt-4 ml-8 ">
          <label className=" font-medium  ml-8">commentaire</label>
          <div className=" w-full pr-8">
            <EditableTextarea
            content={commentaire}
              placeholder="Saisir un commentaire ..."
              onSave={(newComment) => setCommentaire(newComment)}
            />
          </div>
        </div>

        <div className="flex justify-end  items-center  mt-12 gap-8 pr-8">
          {showSave && (
            <button
              className={`bg-[var(--blue-menu)]  border-none text-white px-4   py-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={loading}
              onClick={handleSaveModifications}
            >
              Enregistrer les modifications
            </button>
          )}
          {!action.length != 0 && (

            <button
              className={`bg-[var(--blue-menu)]  border-none text-white px-4 py-2 ${isValidateDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={isValidateDisabled}
              onClick={handleSubmit}
            >
              Envoyer pour revue
            </button>

          )}
        </div>

        {shouldShowRemediation && !action.length != 0 && (
          <div className="flex justify-end m-3 py-6 mr-8 gap-5">
            <button
              onClick={() => setShowRemediation((prevState) => !prevState)}
              className='text-[var(--blue-menu)] px-3 py-2 border-[var(--blue-menu)]'
            >
              Créer une remédiation <AddCircleOutlineRoundedIcon />
            </button>
          </div>
        )}

        {(showRemediation || isAddingAnother) && (
          <Remediation
            title={"Créer une remédiation"}
            initialValues={selectedActionId || {}}
            onAdd={handleAdd}
            idControle={controleID}
            onClose={handleCloseForm}
          />
        )}

        {showDecisionPopup && (
          <div className="absolute top-25 left-1/2 -translate-x-1/2 translate-y-[-50%] z-50 ">
            <DecisionPopUp
              name="nouvelle action"
              text="Voulez-vous ajouter une autre action ?"
              handleConfirm={() => handleDecisionResponse(true)}
              handleDeny={() => handleDecisionResponse(false)}
            />
          </div>
         )} 

        {/* Table for Remédiations */}
        {action?.length > 0 && (
          <div className="min-h-screen">
            <div className="mr-5  ml-9">
              <Separator text={"Remédiation"} />
            </div>
           
            <div className="flex justify-end pb-6 mr-8 gap-5">
              <button
                onClick={() => setShowRemediation((prevState) => !prevState)}
                className='text-[var(--blue-menu)] px-3 py-2 border-[var(--blue-menu)]'
              >
                Créer une remédiation <AddCircleOutlineRoundedIcon />
              </button>
            </div>

           {/* <div className="flex justify-end m-3 py-6 gap-5">
                hadi commentitha w hatit wahda foug 
            {showSave && (
              <button
                onClick={() => setShowRemediation((prevState) => !prevState)}
                className="text-[var(--blue-menu)] px-3  mr-16  py-2 border-[var(--blue-menu)]"
              >
                Créer une remédiation <AddCircleOutlineRoundedIcon />
              </button>
            )} 

            </div>*/}
            <div
              className={` flex-1 overflow-x-auto overflow-y-auto h-[400px] mx-10 transition-all }`}
            >
              {isDeletePopupOpen && (
                <div className="absolute top-45 left-1/2 -translate-x-1/2  translate-y-[-30%] z-50">
                  <DecisionPopUp
                    name={
                      action.find((row) => row.id === selectedActionId)?.actionName ||
                      "cette Action"
                    }
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
                headerTextBackground={"white"}
              headerBackground="var(--blue-menu)"
                statusOptions={statusOptions}
                statusColors={statusColors}
                onCellEditCommit={(params) => {
                  handleAdd(params);
                }}
              />
            </div>

            {/* {action.length > 0 && ( */}
            <div className="flex justify-end mt-5 pr-8">
              {/* {showSave && ( */}
              <button
                className={`bg-[var(--blue-menu)]   text-white px-4 py-2 ${isValidateDisabled || loading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                  }`}
                disabled={isValidateDisabled }
                onClick={handleSubmit}
              >
                Envoyer pour revue{" "}
              </button>
              {/* )} */}
            </div>
            {/* )} */}
          </div>
        )}
      </div>

    </div>
  );
}

{/* <div className="flex justify-end mt-16">
        {showSave && (
          <button
            className={`bg-[var(--blue-menu)] text-white px-4 mr-16 mt-20 py-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
            onClick={handleSaveModifications}
          >
            Enregistrer les modifications
          </button>
        )}
      </div>
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

      {(showRemediation || isAddingAnother) && (
        <Remediation
          title={"Créer une remédiation"}
          initialValues={selectedActionId || {}}
          onAdd={handleAdd}
          idControle={controleID}
          onClose={onClose}
        />
      )}

      {/* Table for Remédiations 
      {action.length > 0 && (
        <div className="min-h-screen">
          <div className="mr-5  ml-9">
            <Separator text={"Remédiation"} />
          </div>
          <div className="flex justify-end m-3 py-6 gap-5">
            {showSave && (
              <button
                onClick={() => setShowRemediation((prevState) => !prevState)}
                className="text-[var(--blue-menu)] px-3  mr-16  py-2 border-[var(--blue-menu)]"
              >
                Créer une remédiation <AddCircleOutlineRoundedIcon />
              </button>
            )}

            {action.length === 0 && (
              <button
                className={`bg-[var(--blue-menu)] text-white px-4 py-2 ${
                  isValidateDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isValidateDisabled}
                onClick={handleSubmit}
              >
                valider
              </button>
            )}
          </div>
          <div
            className={`mt-6 flex-1 overflow-x-auto overflow-y-auto h-[400px] mx-10 transition-all }`}
          >
            {isDeletePopupOpen && (
              <div className="absolute top-50 left-1/2 -translate-x-1/2 z-50 mt-6">
                <DecisionPopUp
                  name={
                    action.find((row) => row.id === selectedActionId)?.id ||
                    "cette Action"
                  }
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
              {showSave && (
                <button
                  className={`bg-[var(--blue-menu)] mr-16  text-white px-4 py-2 ${
                    isValidateDisabled || loading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isValidateDisabled || loading}
                  onClick={handleSubmit}
                >
                  Envoyer pour revue{" "}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} */}

export default ConclusionRemediationSection;