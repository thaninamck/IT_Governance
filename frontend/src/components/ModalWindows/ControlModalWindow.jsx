import React, { useState, useEffect, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InfoDisplayComponent from "../InfosDisplay/InfoDisplayComponent";
import TextDisplay from "./TextDisplay";
import Separator from "../Decorators/Separator";
import useReferentiel from "../../Hooks/useReferentiel";
import SingleOptionSelect from "../Selects/SingleOptionSelect";
import MultiOptionSelect from "../Selects/MultiOptionSelect";

const ControlModalWindow = ({ isOpen, onClose, infosCntrl, onControlUpdated }) => {
  const { typeOptions, sourceOptions } = useReferentiel();

  const [description, setDescription] = useState("");
  const [testScript, setTestScript] = useState("");
  const [majorProcess, setMajorProcess] = useState("");
  const [majorProcessCode, setMajorProcessCode] = useState("");
  const [subProcess, setSubProcess] = useState("");
  const [subProcessCode, setSubProcessCode] = useState("");
  const [sources, setSources] = useState([]);
  const [type, setType] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const typeList = typeOptions.map(opt => [opt.id, opt.name]);
  const sourceList = sourceOptions.map(opt => [opt.id, opt.name]);

  useEffect(() => {
    setDescription(infosCntrl.CntrlDescription || "");
    setTestScript(infosCntrl.TestScript || "");
    setMajorProcess(infosCntrl.MajorProcess?.Designation || "");
    setMajorProcessCode(infosCntrl.MajorProcess?.Code || "");
    setSubProcess(infosCntrl.SubProcess?.Designation || "");
    setSubProcessCode(infosCntrl.SubProcess?.Code || "");
    setSources(infosCntrl.Sources || []);
    setType(infosCntrl.Type || []);
  }, [infosCntrl]);

  const handleChange = useCallback((value, field) => {
    const handlers = {
      CntrlDescription: setDescription,
      TestScript: setTestScript,
      MajorProcess: setMajorProcess,
      SubProcess: setSubProcess,
      Type: setType,
      Sources: setSources,
    };
    if (handlers[field]) handlers[field](value);
  }, []);

  const handleSubmit = () => {
    setIsEditing(false);
    const data = {
      description,
      testScript,
      majorProcess,
      majorProcessCode,
      subProcess,
      subProcessCode,
      sources,
      type,
    };
    onControlUpdated(data, infosCntrl.id);
    onClose();
  };

  return (
    <div className={`fixed w-full min-h-screen bg-gray-600 bg-opacity-50 z-50 ${isOpen ? "block" : "hidden"}`}>
      <div
        className={`bg-white w-auto max-h-[98vh] rounded-lg shadow-lg p-6 fixed top-1/2 right-2 -translate-y-1/2 overflow-y-auto ${
          isOpen ? "animate-slideInRight" : "animate-slideOutRight"
        }`}
      >
        {/* Close Button */}
        <div className="absolute top-0 right-0 p-2" onClick={onClose}>
          <CloseIcon
            sx={{
              color: "#4F4F4F",
              width: "18px",
              height: "18px",
              ":hover": { cursor: "pointer" },
            }}
          />
        </div>

        {/* Title */}
        <h2 className="font-semibold text-xl text-font-gray mb-4">Détails du Contrôle</h2>

        {/* Code */}
        <div className="flex gap-5 my-6 items-start">
        <label className="w-[100px] text-font-gray font-medium">Code:</label>

        <InfoDisplayComponent label="" BoxContent={infosCntrl.Code} borderWidth={60} labelWidth={120} />
        </div>
        {/* Type */}
        <div className="flex gap-5 my-6 items-start">
          <label className="w-[120px] text-font-gray font-medium">Type:</label>
          <div className="w-full">
            {!isEditing ? (
              <InfoDisplayComponent BoxContent={type[1]} borderWidth={80} label="" labelWidth={30} />
            ) : (
              <SingleOptionSelect
                placeholder=""
                width={300}
                statuses={typeList}
                onChange={(id, name) => handleChange([id, name], "Type")}
                checkedStatus={type}
              />
            )}
          </div>
        </div>

        {/* Description & Test Script */}
        <TextDisplay
          label="Description:"
          content={description}
          isEditing={isEditing}
          onContentChange={(val) => handleChange(val, "CntrlDescription")}
          borderWidth="450px"
          labelWidth="120px"
        />
        <TextDisplay
          label="Test Script:"
          content={testScript}
          isEditing={isEditing}
          onContentChange={(val) => handleChange(val, "TestScript")}
          borderWidth="450px"
          labelWidth="120px"
        />

        {/* Sources */}
        <div className="flex gap-5 mt-6 items-start">
          <label className="w-[120px] text-font-gray font-medium">Sources:</label>
          <div className="w-full">
            {isEditing ? (
              <MultiOptionSelect
                placeholder="Sélectionnez les sources"
                width={300}
                height={40}
                objects={sourceList.map(([id, status]) => ({ id, status }))}
                defaultSelected={infosCntrl.Sources}
                onSelectionChange={(selected) => handleChange(selected, "Sources")}
              />
            ) : (
              sources.map(([_, label], index) => (
                <InfoDisplayComponent
                  key={index}
                  BoxContent={label}
                  borderWidth={80}
                  label=""
                  labelWidth={30}
                />
              ))
            )}
          </div>
        </div>

        {/* Major Process */}
        <div className="mt-12 mb-3">
        <Separator text="Major Process" />
        </div>
        <div className="flex gap-5 my-6 items-start">
        <label className="w-[100px] text-font-gray font-medium">Code:</label>

        <InfoDisplayComponent label="" BoxContent={majorProcessCode} borderWidth={50} labelWidth={120} />
        </div>

      
        <TextDisplay
          label="Designation:"
          content={majorProcess}
          isEditing={isEditing}
          onContentChange={(val) => handleChange(val, "MajorProcess")}
          borderWidth="450px"
          labelWidth="120px"
        />

        {/* Sub Process */}
        <div className="mt-12 mb-3">
        <Separator text="Sub Process" />

        </div>
        <div className="flex gap-5 my-6 items-start">
        <label className="w-[100px] text-font-gray font-medium">Code:</label>

        <InfoDisplayComponent label="" BoxContent={subProcessCode} borderWidth={50} labelWidth={120} />
        </div>
       
        <TextDisplay
          label="Designation:"
          content={subProcess}
          isEditing={isEditing}
          onContentChange={(val) => handleChange(val, "SubProcess")}
          borderWidth="450px"
          labelWidth="120px"
        />

        {/* Footer Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          {isEditing ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-menu text-white rounded-md hover:bg-blue-600"
            >
              Valider
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-menu text-white rounded-md hover:bg-gray-400"
            >
              Modifier
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlModalWindow;
