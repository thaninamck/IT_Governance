import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import Breadcrumbs from '../../components/Breadcrumbs'
import TextDisplay from '../../components/ModalWindows/TextDisplay'
import InputForm from '../../components/Forms/InputForm';
import Separator from '../../components/Decorators/Separator';
import FileUploader from '../../components/Evidences/FileUploader';
import EvidenceList from '../../components/Evidences/EvidenceList';
import SelectInput from '../../components/Forms/SelectInput';
import {  useLocation, useNavigate } from 'react-router-dom';

function RemediationActionId() {
    const location = useLocation();
    const remediationData = location.state?.remediationData|| {};
    const navigate = useNavigate();

     const [description, setDescription] = useState(remediationData.description || '');
     const [isEditing, setIsEditing] = useState(true);
     const [dateField, setDateField] = useState(remediationData.dateField||'');
     const [dateField1, setDateField1] = useState(remediationData.dateField1||'');
     const [contact, setContact] = useState( remediationData.contact||'');
     const [selectedMulti, setSelectedMulti] = useState(remediationData.status||'');
     const [files, setFiles] = useState([
        { name: 'document.pdf', size: 1024000 },
        { name: 'image.png', size: 2048000 },
        { name: 'presentation.pptx', size: 512000 }
      ]);
      const [suivi, setSuivi] = useState(
       remediationData.suivi||''
      );

     const handleSave = () => {
        const updatedRemediationData = {
            ...remediationData, // Inclure les anciennes données si nécessaire
            description,
            suivi,
            files,
            status: selectedMulti,
            dateField,
            dateField1,
            contact
          };
     
          console.log('Données mises à jour:', updatedRemediationData);
        console.log('Description:', description,
          'Suivi:', suivi,
          'files:',files ,
          'status:',selectedMulti,
          'Date debut', dateField,
          'Date fin',dateField1,
          'contact',contact,

         
        );
        //setIsEditing(false); // Quitter le mode édition après la sauvegarde
      };
      const handleSaveFiles = (formData) => {
        const newFiles = [];
        for (const [key, file] of formData.entries()) {
          newFiles.push({ name: file.name, size: file.size });
        }
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      };
      const handleDelete = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
      };
      const isValidateDisabled = !selectedMulti
      
  return (
    <div>
        <Header/>
        <div className='ml-5 mr-6 pb-9'>
        <Breadcrumbs />

        <div className='flex flex-row justify-between  w-[95%] py-6 '>
        <InputForm
          type="date"
          label="Date Début"
          width="250px"
          flexDirection="flex-row gap-4 items-center mb-2 "
          value={dateField}
          onChange={(e) => setDateField(e.target.value)}
        />
        
        <InputForm
          type="date"
          label="Date Fin"
          width="250px"
          flexDirection="flex-row gap-4 items-center mb-2"
          value={dateField1}
          onChange={(e) => setDateField1(e.target.value)}
        />
        <InputForm
          type="email"
          label="Contact"
          placeholder="Entrez l'e-mail de la personne concernée..."
          width="350px"
          flexDirection="flex-row gap-4 items-center mb-2"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        </div>
        <Separator text={'Description'} />
        <TextDisplay
        label=""
        content={description}
        isEditing={isEditing}
        onSave={handleSave}
        onContentChange={setDescription}
        borderWidth="95%"
        labelWidth="120px"
        flexDirection="column"
        marginLeft="30px"
      />

<Separator text={'Evidences'} />
      
      <FileUploader onSave={handleSaveFiles} />
      <div className='flex flex-col items-center w-full my-6'>
        <EvidenceList files={files} onDelete={handleDelete} />
      </div>
      {files.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Aucun fichier disponible.</p>
      )}

<Separator text={'Suivi'} />

<TextDisplay
          label=""
          content={suivi}
          isEditing={isEditing}
          onContentChange={setSuivi}
          onSave={handleSave}
          borderWidth="95%"
          labelWidth="120px"
          flexDirection="column"
          marginLeft="30px"
        />

<Separator text={'Conclusion'} />
<div className='flex flex-row items-center gap-4  ml-2'>
        <label className="mr-8 font-medium">Status</label>
        <SelectInput
          label=""
          options={[
            { label: "Terminé", value: "Terminé" },
            { label: "En_cours", value: "En_cours" },
            { label: "Non_comencee", value: "Non_commencee" },
          ]}
          value={selectedMulti}
          onChange={(e) => setSelectedMulti(e.target.value)}
          width="200px"
          multiSelect={false}
          mt="mt-10"
        />
        </div>

        <div className="flex justify-end mx-16 mt-9 py-4  gap-5">
        
          <button
            className={`bg-[var(--blue-menu)] text-white px-4 py-2 ${isValidateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isValidateDisabled}
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