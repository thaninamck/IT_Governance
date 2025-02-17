import { useLocation, useParams } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import MissionInfo from '../../components/InfosDisplay/MissionInfo';
import AddScope from '../../components/InfosDisplay/AddScope';
import { useState } from 'react';
import Header from '../../components/Header/Header';
import Separator from '../../components/Decorators/Separator';
import TextDisplay from '../../components/ModalWindows/TextDisplay';
import ToggleButton from '../../components/ToggleButtons';
import FileUploader from '../../components/Evidences/FileUploader';
import EvidenceList from '../../components/Evidences/EvidenceList';
import SelectInput from '../../components/Forms/SelectInput';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Remediation from '../../components/Forms/Remediation';
import AddRemediation from '../subPages/AddRemediation';
import Table from '../../components/Table';

function ControleExcutionPage() {
  const [description, setDescription] = useState("User access rights are removed on termination of employment or contract, or adjusted (starters, leavers, movers) upon change of role.");
  const [testScript, setTestScript] = useState(
    "1. Obtain the access management policy,\n" +
    "2. Obtain HR list of departures during the audited period,\n" +
    "3. Obtain the 3rd party list of leavers during the audited period,\n" +
    "4. Obtain the list of active AD user accounts,\n" +
    "5. Obtain HR list of departures during the audited period,\n" +
    "6. Obtain the 3rd party list of leavers during the audited period,\n" +
    "7. Obtain the list of active AD user accounts,\n" +
    "8. Obtain the list of application user accounts."
  );

  const columnsConfig = [
    { field: 'id', headerName: 'ID', width: 170, editable: true },
    { field: 'description', headerName: 'Description', editable: true, width: 220 },
    { field: 'contact', headerName: 'Contact', width: 200 },
    { field: 'dateField', headerName: 'Date début', width: 200 },
    { field: 'dateField1', headerName: 'Date Fin', width: 200 },
    { field: 'suivi', headerName: 'Suivi', width: 200 },
    { field: 'status', headerName: 'Status', width: 200 },
    { field: 'actions', headerName: 'Action', width: 80 },
  ]

  const [commentaire, setCommentaire] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveFiles = (formData) => {
    const newFiles = [];
    for (const [key, file] of formData.entries()) {
      newFiles.push({ name: file.name, size: file.size });
    }
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const [files, setFiles] = useState([
    { name: 'document.pdf', size: 1024000 },
    { name: 'image.png', size: 2048000 },
    { name: 'presentation.pptx', size: 512000 }
  ]);

  const handleDelete = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };
// Options et couleurs de statut utilisateur
const statusOptions = ["Terminé", "En_cours","Non_commencee"];
const statusColors = { Terminé: 'green', En_cours: 'orange' ,Non_Commencée:'gray'};
  const [selectedMulti, setSelectedMulti] = useState('');
  const options = [
    { label: "Applied", value: "Applied" },
    { label: "Partially Applied", value: "Partially Applied" },
    { label: "Not Applied", value: "Not Applied" },
    { label: "Not Tested", value: "Not Tested" },
    { label: "Not Applicable", value: "Not Applicable" },
  ];
  const [showRemediation, setShowRemediation] = useState(false);
  const shouldShowRemediation = selectedMulti === 'Partially Applied' || selectedMulti === 'Not Applied';
  const isValidateDisabled = !selectedMulti || shouldShowRemediation;
  const [action, setAction] = useState([
  //   {id:1,description:'llllll',contact:'farid@gmail.com',dateField:'5/20/2025',dateField1:'6/01/2025', suivi:'llllm',status:'Terminé'},
  //   {id:2,description:'llllll',contact:'farid@gmail.com',dateField:'5/20/2025',dateField1:'6/01/2025', suivi:'llllm',status:'Terminé'},
  //   {id:3,description:'llllll',contact:'farid@gmail.com',dateField:'5/20/2025',dateField1:'6/01/2025', suivi:'llllm',status:'Terminé'},
   
  ]);

  const handleAdd = (remediation) => {
    setAction((prev) => [
      ...prev,
      { id: prev.length + 1, ...remediation} // Add the remediation to the list
    ]);
  };

  return (
    <div className=" ">
      <Header />
      <div className='ml-5 mr-6 pb-9'>
        <Breadcrumbs />
        <Separator text={'Description'} />

        <TextDisplay
          label="Description"
          content={description}
          isEditing={isEditing}
          onContentChange={setDescription}
          borderWidth="95%"
          labelWidth="120px"
          flexDirection="column"
          marginLeft='15px'
        />
        <div className='mt-4 mb-6'>
          <TextDisplay
            label="Test Script"
            content={testScript}
            isEditing={isEditing}
            onContentChange={setTestScript}
            borderWidth="95%"
            labelWidth="120px"
            flexDirection="column"
            marginLeft='15px'
          />
        </div>
        <Separator text={'Evidences'} />
        <div className='flex items-center justify-center mt-8 mb-12'>
          <ToggleButton />
        </div>
        <FileUploader onSave={handleSaveFiles} />

        <div className='flex flex-col items-center w-full my-6'>
          <EvidenceList files={files} onDelete={handleDelete} />
        </div>

        {files.length === 0 && (
          <p className="text-center text-gray-500 mt-4">Aucun fichier disponible.</p>
        )}

        <Separator text={'Conclusion'} />
        <div className='flex flex-row items-center gap-12 py-7'>
          <label className="mr-8 font-medium">Status</label>
          <SelectInput
            label=""
            options={options}
            value={selectedMulti}
            onChange={(e) => setSelectedMulti(e.target.value)}
            width="200px"
            multiSelect={false}
            mt="mt-10"
          />

          {shouldShowRemediation && (
            <div className='flex flex-row items-center gap-1'>
              <ErrorOutlineIcon sx={{ color: 'var(--await-orange)' }} />
              <span className='text-[var(--await-orange)]'>Vous devriez completer la section remédiation</span>
            </div>
          )}
        </div>

        <TextDisplay
          label="Commentaire"
          content={commentaire}
          isEditing={isEditing}
          onContentChange={setTestScript}
          borderWidth="95%"
          labelWidth="120px"
          flexDirection="row"
          marginLeft='15px'
        />
       
        <div className="flex justify-end m-3 py-6 gap-5">
          {shouldShowRemediation && (
            <button
              onClick={() => {
                setShowRemediation((prevState) => !prevState);
              }}
              className='text-[var(--blue-menu)] px-3 py-2 border-[var(--blue-menu)]'
            >
              Créer une remédiation <AddCircleOutlineRoundedIcon />
            </button>
          )}
           {action.length === 0 && (
          <button
            className={`bg-[var(--blue-menu)] text-white px-4 py-2 ${isValidateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isValidateDisabled}
          >Valider</button>)}
        </div>
        

        {showRemediation && <Remediation title={'Créer une remédiation'} onAdd={handleAdd} />}

        {/* Display the list of actions (remediations) at the bottom */}
        {action.length > 0 && (
          <>
         <Separator text={'Remédiation'} />
           <div className={`mt-6 flex-1 overflow-x-auto overflow-y-auto h-[400px] transition-all }`}>
           <Table
             key={JSON.stringify(action)}
             columnsConfig={columnsConfig}
             rowsData={action}
             checkboxSelection={false}
             headerBackground="var(--blue-nav)"
             statusOptions={statusOptions}
             statusColors={statusColors}
             
             //rowActions={rowActions}
             onCellEditCommit={(params) => {
               setAction((prev) =>
                 prev.map((row) =>
                   row.id === params.id ? { ...row, [params.field]: params.value } : row
                 )
               );
             }}
           />
         </div>
          {/* Move "Valider" Button Below Table if there are actions */}
        {action.length > 0 && (
          <div className="flex justify-end mt-5">
            <button
              className={`bg-[var(--blue-menu)] text-white px-4 py-2 ${isValidateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isValidateDisabled}
            >
              Valider
            </button>
          </div>
        )}
         </>
        )}
      </div>
    </div>
  );
}

export default ControleExcutionPage;
