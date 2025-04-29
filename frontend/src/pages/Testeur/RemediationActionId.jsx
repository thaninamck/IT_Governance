import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import Breadcrumbs from '../../components/Breadcrumbs'
import TextDisplay from '../../components/ModalWindows/TextDisplay'
import InputForm from '../../components/Forms/InputForm';
import Separator from '../../components/Decorators/Separator';
import FileUploader from '../../components/Evidences/FileUploader';
import EvidenceList from '../../components/Evidences/EvidenceList';
import SelectInput from '../../components/Forms/SelectInput';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, fileApi } from '../../Api';
import { useAuth } from '../../Context/AuthContext';
import EditableTextarea from '../../components/EditableInput';
import DecisionPopUp from '../../components/PopUps/DecisionPopUp';
import useRemediation from '../../Hooks/useRemediation';
import useAction from '../../Hooks/useAction';
import AssignmentIcon from '@mui/icons-material/Assignment';


function RemediationActionId({readOnly =false}) {

  const location = useLocation();
  const remediationData = location.state?.remediationData || {};
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(true);


  useEffect(() => {
    if (location.pathname.includes('/revue/revueExecution')) {
      setIsEditing(false); // Par exemple, ici tu peux désactiver l'édition si readOnly est vrai
    }
  }, [location.pathname]);

  console.log('remediation data', remediationData)
  const {
    actionData,
    setActionData,
    isSavingSuivi,
    loading,
    error,
    statusOptions,
    openDeletePopup,
    setOpenDeletePopup,
    handleSave,
    handleSaveFiles,
    handleDelete,
    handleDeleteConfirm
  } = useAction(remediationData);

  //   const location = useLocation();
  //   const remediationData = location.state?.remediationData|| {};
  //   const [isSavingSuivi, setIsSavingSuivi] = useState(false);
  //   const [openDeletePopup, setOpenDeletePopup] = useState(false);
  //   const [isEditing, setIsEditing] = useState(true);
  //   const{user}=useAuth();
  //    const [loading, setLoading] = useState(true);
  //     const [error, setError] = useState(null);
  //     const [statusOptions, setStatusOptions] = useState([]);

  //   const [actionData, setActionData] = useState({
  //     description: '',
  //     suivi: '',
  //     ownerContact: '',
  //     statusName: '' ,
  //     startDate: '',
  //     endDate: '',
  //     //actionName:'',
  //     files: []
  // }); 
  //    // Chargement des données
  //    useEffect(() => {
  //     const fetchActionData = async () => {
  //         try {
  //             const response = await api.get(`/execution/getRemediation/${remediationData.id}`);
  //             console.log('response action',response.data)
  //             setActionData({
  //                 ...response.data,
  //                 files: response.data.remediation_evidences || []
  //             });
  //             console.log('action',actionData)
  //         } catch (err) {
  //             setError(err.message);
  //         } finally {
  //             setLoading(false);
  //         }
  //     };

  //     const fetchStatusOptions = async () => {
  //       try {
  //         const res = await api.get("/remediation/get-options");
  //         const options = res.data.map(status => ({
  //           value: status.id,
  //           label: status.status_name
  //         }));
  //         setStatusOptions(options);
  //       } catch (err) {
  //         console.error("Erreur de récupération des statuts :", err);
  //       }
  //     };


  //     if (remediationData.id) {
  //       fetchActionData();
  //     }
  //     fetchStatusOptions();
  // }, [remediationData.id]);



  //   const handleSave = async () => {
  //     try {
  //       const transformedremediation = {
  //         id: actionData.id,
  //         description: actionData.description,
  //         owner_cntct: actionData.ownerContact,
  //         follow_up:actionData.suivi,
  //         start_date: actionData.startDate,
  //         end_date:actionData.endDate,
  //       };

  //       // Transformer en FormData
  //       const formData = new FormData();
  //       Object.entries(transformedremediation).forEach(([key, value]) => {
  //         formData.append(key, value);
  //       });    
  //         // Ajoutez les fichiers (si nouveau upload)
  //         remediationData?.files?.forEach(file => {
  //             if (file instanceof File) {
  //                 formData.append('files[]', file);
  //             }
  //         });

  //         const response = await api.put( `/execution/updateRemediation/${remediationData.id}`,formData, );

  //         console.log('Réponse du serveur:', response.data);
  //         // Afficher un message de succès ou rediriger

  //     } catch (err) {
  //         console.error('Erreur lors de la sauvegarde:', err);
  //         setError('Erreur lors de la sauvegarde');
  //     }
  // };

  // const handleSaveSuivi = useCallback(async (suiviValue) => {
  //   if (!actionData.id) return;

  //   setIsSavingSuivi(true);
  //   try {
  //     await api.put(`/execution/updateRemediation/${actionData.id}`, {
  //       follow_up: suiviValue
  //     });
  //   } catch (err) {
  //     console.error('Erreur sauvegarde suivi:', err);
  //   } finally {
  //     setIsSavingSuivi(false);
  //   }
  // }, [actionData.id]);

  // // Modifiez le useEffect d'auto-save
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (actionData.id) {
  //       handleSaveSuivi(actionData.suivi);
  //     }
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [actionData.suivi, handleSaveSuivi,actionData.id]);

  // const handleSaveFiles = async (formData) => {
  //   const formDataToSend = new FormData();
  //   const remediation_id = actionData.id;

  //   let index = 0;
  //   for (const [key, file] of formData.entries()) {
  //     // Ajouter le fichier avec ses métadonnées indexées
  //     formDataToSend.append(`files[${index}]`, file);
  //     formDataToSend.append(`files[${index}][remediation_id]`, remediation_id);
  //     index++;
  //   }

  //   // Debug du contenu
  //   for (let pair of formDataToSend.entries()) {
  //     console.log(pair[0], pair[1]);
  //   }

  //   try {
  //     console.log('formdata to send',formDataToSend)
  //     const response = await fileApi.post('/remediationevidences/upload', formDataToSend) 

  //     console.log("response data", response.data);

  //     if (response.status === 200 && Array.isArray(response.data)) {
  //       setActionData(prev => ({
  //         ...prev,
  //         files: [...(prev.files || []), ...response.data]
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Erreur lors de l'upload des fichiers:", error);
  //     setError("Échec de l'upload des fichiers.");
  //   }
  // };

  //  const handleDeleteConfirm = async () => {
  //   setOpenDeletePopup(false); // Fermer la popup de confirmation
  //   const fileToDelete = actionData.fileToDelete;
  //   console.log('dile to delete',actionData.fileToDelete)
  //  try{
  //     const response = await api.delete(`/remediationevidences/delete-evidence/${fileToDelete.id}`);
  //     if (response.status === 200 || response.status === 204) {
  //       setActionData(prev => ({
  //         ...prev,
  //         files: prev.files.filter(f => f.id !== fileToDelete.id),
  //         fileToDelete: null
  //       }));
  //     }
  //   }catch (error) {
  //     console.error("Erreur lors de la suppression des fichiers:", error);
  //     setError("Échec de la suppression des fichiers.");

  //   }

  // };
  // const handleDelete = (index) => {
  //   const deletedFile = actionData.files[index];
  //   setActionData(prev => ({
  //     ...prev,
  //     fileToDelete: deletedFile
  //   }));
  //   setOpenDeletePopup(true);

  //   } 


  // const isValidateDisabled = !selectedMulti
  const getFileURL = `http://127.0.0.1:8000/storage/Remediationevidences/`;

  return (
    <div>
      <Header user={user} />
      <div className='ml-5 mr-6 pb-9'>
        <Breadcrumbs />

        <h1 className='text-xl text-center font-semibold py-4 text-[var(--blue-menu)]'>
        {readOnly && (
    <>
      <AssignmentIcon  style={{ fontSize: 30, color: 'var(--blue-menu)' ,marginRight:'6px'}} />
      Consultation
    </>
  )}
          </h1>
        <div className='flex flex-row justify-between  w-[95%] py-6 '>
          <InputForm
          readOnly
            type="date"
            label="Date Début"
            width="250px"
            flexDirection="flex-row gap-4 items-center mb-2 "
            value={actionData.startDate}
            onChange={e => setActionData({ ...actionData, startDate: e.target.value })}
          />

          <InputForm
          readOnly
            type="date"
            label="Date Fin"
            width="250px"
            flexDirection="flex-row gap-4 items-center mb-2"
            value={actionData.endDate}
            onChange={e => setActionData({ ...actionData, endDate: e.target.value })}
          />
          <InputForm
          readOnly
            type="email"
            label="Contact"
            placeholder="Entrez l'e-mail de la personne concernée..."
            width="350px"
            flexDirection="flex-row gap-4 items-center mb-2"
            value={actionData.ownerContact}
            onChange={e => setActionData({ ...actionData, ownerContact: e.target.value })}
          />
        </div>
        <Separator text={'Description'} />
        <TextDisplay
     
          label=""
          content={actionData.description}
          isEditing={isEditing}
          onSave={handleSave}
          onContentChange={(value) =>
            setActionData({ ...actionData, description: value })
          }

          borderWidth="95%"
          labelWidth="120px"
          flexDirection="column"
          marginLeft="30px"
        />

        <Separator text={'Evidences'} />

       {!readOnly && <FileUploader onSave={handleSaveFiles} />}
        <div className='flex flex-col items-center w-full my-6'>
          <EvidenceList files={actionData.files} onDelete={handleDelete}  getFile={getFileURL} readOnly={readOnly} />
        </div>
        {actionData.files.length === 0 && (
          <p className="text-center text-gray-500 mt-4">Aucun fichier disponible.</p>
        )}
        {openDeletePopup && (
          <DecisionPopUp
            //loading={loading}
            handleDeny={() => setOpenDeletePopup(false)}
            handleConfirm={handleDeleteConfirm}
            text="Confirmation de suppression"
            name="Êtes-vous sûr de vouloir supprimer ce fichier ?"
          />
        )}

        <Separator text={'Suivi'} />

        {/* <TextDisplay
          label=""
          content={actionData.suivi}
          isEditing={isEditing}
          onContentChange={(value) =>
            setActionData({ ...actionData, suivi: value })
          }
          
          onSave={handleSave}
          borderWidth="95%"
          labelWidth="120px"
          flexDirection="column"
          marginLeft="30px"
        /> */}
        {/* <EditableTextarea
  content={actionData.suivi}
  placeholder=""
  onSave={(value) => {
    setActionData(prev => {
      const updated = { ...prev, suivi: value };
      handleSaveSuivi(updated); // Appelle la fonction avec les nouvelles données
      return updated;
    });
  }}
/> */}

        <EditableTextarea
        readOnly={readOnly}
          content={actionData.suivi}
          placeholder=""
          onSave={(value) => {
            setActionData(prev => ({
              ...prev,
              suivi: value
            }));

          }}
        />

        {isSavingSuivi && (
          <div className="flex items-center gap-2 text-sm text-gray-500 italic mt-1 ml-4">
            <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Enregistrement en cours...
          </div>
        )}



        <Separator text={'Conclusion'} />
        <div className='flex flex-row items-center gap-4  ml-2'>
          <label className="mr-8 font-medium">Status</label>
          <p>{actionData.statusName}</p>
          {/* <SelectInput
          label=""
          options={statusOptions}
          value={actionData.statusName}
          onChange={e => setActionData({ ...actionData, statusName: e.target.value })}
          width="200px"
          multiSelect={false}
          mt="mt-10"
        /> */}
        </div>

        <div className="flex justify-end mx-16 mt-9 py-4  gap-5">

          {/* <button
            className={`bg-[var(--blue-menu)] text-white px-4 py-2 ${isValidateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isValidateDisabled}
            onClick={handleSave}
          > */}
          <button
            className={`bg-[var(--blue-menu)] text-white px-4 py-2 `}
            // disabled={isValidateDisabled}
            onClick={handleSave}
          >
            Valider
          </button>
        </div>

      </div>
    </div>
  )
}

export default RemediationActionId