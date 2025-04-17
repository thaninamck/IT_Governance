import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import Breadcrumbs from '../../components/Breadcrumbs'
import TextDisplay from '../../components/ModalWindows/TextDisplay'
import InputForm from '../../components/Forms/InputForm';
import Separator from '../../components/Decorators/Separator';
import FileUploader from '../../components/Evidences/FileUploader';
import EvidenceList from '../../components/Evidences/EvidenceList';
import SelectInput from '../../components/Forms/SelectInput';
import {  useLocation, useNavigate } from 'react-router-dom';
import { api, fileApi } from '../../Api';
import { useAuth } from '../../Context/AuthContext';
import EditableTextarea from '../../components/EditableInput';

function RemediationActionId() {
    const location = useLocation();
    const remediationData = location.state?.remediationData|| {};
    const navigate = useNavigate();
    const [isSavingSuivi, setIsSavingSuivi] = useState(false);

    const{user}=useAuth();
     const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [statusOptions, setStatusOptions] = useState([]);

    const [actionData, setActionData] = useState({
      description: '',
      suivi: '',
      ownerContact: '',
      statusName: '' ,
      startDate: '',
      endDate: '',
      //actionName:'',
      files: []
  });
     const [description, setDescription] = useState(remediationData.description || '');
      const [isEditing, setIsEditing] = useState(true);
     const [dateField, setDateField] = useState(remediationData.dateField||'');
    const [dateField1, setDateField1] = useState(remediationData.dateField1||'');
     const [contact, setContact] = useState( remediationData.contact||'');
    // const [selectedMulti, setSelectedMulti] = useState(remediationData.status||'');
    //  const [files, setFiles] = useState([
    //      { name: 'document.pdf', size: 1024000 },
    //      { name: 'image.png', size: 2048000 },
    //      { name: 'presentation.pptx', size: 512000 }
    //    ]);
      // const [suivi, setSuivi] = useState(
      //   remediationData.suivi||''
      //  );

       
     // Chargement des données
     useEffect(() => {
      const fetchActionData = async () => {
          try {
              const response = await api.get(`/execution/getRemediation/${remediationData.id}`);
              console.log('response action',response.data)
              setActionData({
                  ...response.data,
                  files: response.data.remediation_evidences || []
              });
              console.log('action',actionData)
          } catch (err) {
              setError(err.message);
          } finally {
              setLoading(false);
          }
      };

      const fetchStatusOptions = async () => {
        try {
          const res = await api.get("/remediation/get-options");
          const options = res.data.map(status => ({
            value: status.id,
            label: status.status_name
          }));
          setStatusOptions(options);
        } catch (err) {
          console.error("Erreur de récupération des statuts :", err);
        }
      };
    

      if (remediationData.id) {
        fetchActionData();
      }
      fetchStatusOptions();
  }, [remediationData.id]);

    //  const handleSave = () => {
    //     const updatedRemediationData = {
    //         ...remediationData, // Inclure les anciennes données si nécessaire
    //         description,
    //         suivi,
    //         files,
    //         status: selectedMulti,
    //         dateField,
    //         dateField1,
    //         contact
    //       };
     
    //       console.log('Données mises à jour:', updatedRemediationData);
    //     console.log('Description:', description,
    //       'Suivi:', suivi,
    //       'files:',files ,
    //       'status:',selectedMulti,
    //       'Date debut', dateField,
    //       'Date fin',dateField1,
    //       'contact',contact,

         
    //     );
    //     //setIsEditing(false); // Quitter le mode édition après la sauvegarde
    //    };

    const handleSave = async () => {
      try {
        const transformedremediation = {
          id: actionData.id,
          description: actionData.description,
          owner_cntct: actionData.ownerContact,
          follow_up:actionData.suivi,
          start_date: actionData.startDate,
          end_date:actionData.endDate,
        };
        
        // Transformer en FormData
        const formData = new FormData();
        Object.entries(transformedremediation).forEach(([key, value]) => {
          formData.append(key, value);
        });

          //formData.append('status', remediationData.status);
          
          // Ajoutez les fichiers (si nouveau upload)
          remediationData?.files?.forEach(file => {
              if (file instanceof File) {
                  formData.append('files[]', file);
              }
          });

          const response = await api.put( `/execution/updateRemediation/${remediationData.id}`,formData, );

          console.log('Réponse du serveur:', response.data);
          // Afficher un message de succès ou rediriger

      } catch (err) {
          console.error('Erreur lors de la sauvegarde:', err);
          setError('Erreur lors de la sauvegarde');
      }
  };

  // const handleSaveSuivi = async (updatedActionData = actionData) => {
  //  // if (!updatedActionData?.id || updatedActionData.suivi === undefined) return;
  //   setIsSavingSuivi(true); 
  //   try {
  //     const transformedremediation = {
  //       id: updatedActionData.id,
  //       follow_up: updatedActionData.suivi ?? "" 
  //     };
  
  //     const formData = new FormData();
  //     Object.entries(transformedremediation).forEach(([key, value]) => {
  //       formData.append(key, value);
  //     });
  
  //     const response = await api.put(`/execution/updateRemediation/${remediationData.id}`, formData);
  //     console.log('Réponse du serveur:', response.data);
  //   } catch (err) {
  //     console.error('Erreur lors de la sauvegarde:', err);
  //     setError('Erreur lors de la sauvegarde');
  //   } finally {
  //     setIsSavingSuivi(false); // Fin du chargement
  //   }
  // };
// Auto-saving du suivi
// useEffect(() => {
//   const timer = setTimeout(() => {
//       if (actionData.suivi !== '' && actionData.id) {
//         console.log("Auto-saving", actionData.suivi);
//           handleSaveSuivi(actionData);
//       }
//   }, 1000); // 1 seconde après le dernier changement

//   return () => clearTimeout(timer);
// }, [actionData.suivi, actionData.id]); // Déclenché quand suivi change



  const handleSaveSuivi = useCallback(async (suiviValue) => {
    if (!actionData.id) return;
    
    setIsSavingSuivi(true);
    try {
      await api.put(`/execution/updateRemediation/${actionData.id}`, {
        follow_up: suiviValue
      });
    } catch (err) {
      console.error('Erreur sauvegarde suivi:', err);
    } finally {
      setIsSavingSuivi(false);
    }
  }, [actionData.id]);
  
  // Modifiez le useEffect d'auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (actionData.id) {
        handleSaveSuivi(actionData.suivi);
      }
    }, 2000);
  
    return () => clearTimeout(timer);
  }, [actionData.suivi, handleSaveSuivi,actionData.id]);

  const handleSaveFiles = async (formData) => {
    const formDataToSend = new FormData();
    const remediation_id = actionData.id;
  
    let index = 0;
    for (const [key, file] of formData.entries()) {
      // Ajouter le fichier avec ses métadonnées indexées
      formDataToSend.append(`files[${index}]`, file);
      formDataToSend.append(`files[${index}][remediation_id]`, remediation_id);
      index++;
    }
  
    // Debug du contenu
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      console.log('formdata to send',formDataToSend)
      const response = await fileApi.post('/remediationevidences/upload', formDataToSend) 
        
      console.log("response data", response.data);
  
      if (response.status === 200 && Array.isArray(response.data)) {
        setActionData(prev => ({
          ...prev,
          files: [...(prev.files || []), ...response.data]
        }));
      }
    } catch (error) {
      console.error("Erreur lors de l'upload des fichiers:", error);
      setError("Échec de l'upload des fichiers.");
    }
  };
  
  
      //  const handleSaveFiles = (formData) => {
      //   const newFiles = [];
      //   for (const [key, file] of formData.entries()) {
      //     newFiles.push({ name: file.name, size: file.size });
      //   }
      //   setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      //  };
       const handleDelete = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
       };
      // const isValidateDisabled = !selectedMulti
      
  return (
    <div>
        <Header user={user}/>
        <div className='ml-5 mr-6 pb-9'>
        <Breadcrumbs />

        <div className='flex flex-row justify-between  w-[95%] py-6 '>
        <InputForm
          type="date"
          label="Date Début"
          width="250px"
          flexDirection="flex-row gap-4 items-center mb-2 "
          value={actionData.startDate}
          onChange={e => setActionData({ ...actionData, startDate: e.target.value })}
        />
        
        <InputForm
          type="date"
          label="Date Fin"
          width="250px"
          flexDirection="flex-row gap-4 items-center mb-2"
          value={actionData.endDate}
          onChange={e => setActionData({ ...actionData, endDate: e.target.value })}
        />
        <InputForm
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
      
      <FileUploader onSave={handleSaveFiles} />
      <div className='flex flex-col items-center w-full my-6'>
        <EvidenceList files={actionData.files} onDelete={handleDelete} />
      </div>
      {actionData.files.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Aucun fichier disponible.</p>
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