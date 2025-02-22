import React from 'react';
import Separator from '../../components/Decorators/Separator';
import TextDisplay from '../../components/ModalWindows/TextDisplay';
import InputForm from '../../components/Forms/InputForm';
import SelectInput from '@mui/material/Select/SelectInput';

function DescriptionTestScriptSection({
  description,
  setDescription,
  testScript,
  setTestScript,
  isEditing,
  handleSave,
  type,
  majorProcess,
  subProcess,
 
}) {
  return (
    <div>
      <Separator text={'Description'} />
      <div className='flex flex-row justify-between w-[97%] px-3 py-4 ' >
      <InputForm
          type="text"
          label="Type"
          placeholder=""
          width="150px"
          flexDirection="flex-row gap-4 items-center mb-2"
          value={type}
          readOnly
        />
         <InputForm
          type="text"
          label="Major Process"
          placeholder=""
          width="150px"
          flexDirection="flex-row gap-4 items-center mb-2"
          value={majorProcess}
          readOnly
        />
         <InputForm
          type="text"
          label="Sub Process"
          placeholder=""
          width="150px"
          flexDirection="flex-row gap-4 items-center mb-2"
          value={subProcess}
          readOnly
        
        />
        
        </div>
      <TextDisplay
        label="Description"
        content={description}
        isEditing={isEditing}
        onSave={handleSave}
        onContentChange={setDescription}
        borderWidth="95%"
        labelWidth="120px"
        flexDirection="column"
        marginLeft="15px"
      />

      <div className="mt-4 mb-6">
        <TextDisplay
          label="Test Script"
          content={testScript}
          isEditing={isEditing}
          onContentChange={setTestScript}
          onSave={handleSave}
          borderWidth="95%"
          labelWidth="120px"
          flexDirection="column"
          marginLeft="15px"
        />
      </div>
    </div>
  );
}

export default DescriptionTestScriptSection;
