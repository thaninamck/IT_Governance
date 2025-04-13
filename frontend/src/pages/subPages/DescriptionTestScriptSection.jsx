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
  onTestScriptChange, // Fonction pour récupérer les données du test script en temps réel
}) {
  return (
    <div className="">
      <div className="mr-6" >
      <Separator text={"Description"} />

      </div>
      
      <div className="flex flex-row justify-between w-full my-5 py-4  ">
          <InputForm
            type="text"
            label="Type"
            placeholder=""
            width="55%"
            flexDirection="flex-row gap-4 items-center mb-2"
            value={type}
            readOnly
          />
        
        <InputForm
          type="text"
          label="Major Process"
          placeholder=""
          width="55%"
          flexDirection="flex-row gap-4 items-center mb-2"
          value={majorProcess}
          readOnly
        />
        <InputForm
          type="text"
          label="Sub Process"
          placeholder=""
          width="55%"
          flexDirection="flex-row gap-4 items-center mb-2"
          value={subProcess}
          readOnly
        />
        <InputForm
          type="text"
          label="Owner du controle"
          placeholder=""
          width="55%"
          flexDirection="flex-row gap-4 items-center mb-2"
          value={controlOwner}
          readOnly
        />
      </div>
      <div className=" flex flex-row    gap-1 ">
      <InputForm
          type="text"
          label="Description:"
          placeholder=""
          width="55%"
          flexDirection="flex-row gap-4 items-center mb-2"
          value={description}
          readOnly
        />
      </div>

      <div className=" mt-2 flex flex-col gap-2  w-[98%]  ">
        {/* <TextDisplay
          label="Test Script"
          content={testScript}
          isEditing={isEditing}
          onContentChange={setTestScript}
          onSave={handleSave}
          borderWidth="95%"
          labelWidth="120px"
          flexDirection="column"
          marginLeft="15px"
        /> */}

        <InstructionSplitter
          steps={testScript}
          onChange={onTestScriptChange} // Passer la fonction de rappel
        />
      </div>
    </div>
  );
}

export default DescriptionTestScriptSection;
