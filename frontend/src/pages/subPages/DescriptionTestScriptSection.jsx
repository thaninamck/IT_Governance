import React from "react";
import Separator from "../../components/Decorators/Separator";
import TextDisplay from "../../components/ModalWindows/TextDisplay";
import InputForm from "../../components/Forms/InputForm";
import SelectInput from "@mui/material/Select/SelectInput";
import InstructionSplitter from "../../components/InstructionSplitter";
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
  controlOwner,
  sources,
  onTestScriptChange,
  readOnly, // Fonction pour récupérer les données du test script en temps réel
}) {
  return (
    <div className="min-h-screen">
      <div className="grid  grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 w-full my-6  px-6 py-6 bg-white  rounded-xl">
        <InputForm
          type="text"
          label="Type du contrôle "
          placeholder=""
          width="100%"
          flexDirection="flex-col"
          value={type}
          readOnly
        />
        <InputForm
          type="text"
          label="Propriétaire"
          placeholder=""
          width="100%"
          flexDirection="flex-col"
          value={controlOwner}
          readOnly
        />
        <InputForm
          type="text"
          label="Source du contrôle "
          placeholder=""
          width="100%"
          flexDirection="flex-col"
          value={sources}
          readOnly
          multiline={true}
        />
        
        
        <InputForm
          type="text"
          label="Sub Process"
          placeholder=""
          width="100%"
          flexDirection="flex-col"
          value={subProcess}
          readOnly
          multiline={true}
        />
        <InputForm
          type="text"
          label="Description du contrôle "
          placeholder=""
          width="100%"
          flexDirection="flex-col"
          value={description}
          readOnly
          multiline={true}
        />
        
        <InputForm
          type="text"
          label="Major Process"
          placeholder=""
          width="100%"
          flexDirection="flex-col"
          value={majorProcess}
          readOnly
          multiline={true}
        />
        
      </div>

      <div className=" my-16 mx-8 flex flex-col   w-[98%]  ">
      

        <InstructionSplitter
          steps={testScript}
          onChange={onTestScriptChange} 
          readOnly={readOnly}// Passer la fonction de rappel
        />
      </div>
    </div>
  );
}

export default DescriptionTestScriptSection;
