import React, { useState } from 'react';

import ToggleButton from '../../components/ToggleButtons';
import FileUploader from '../../components/Evidences/FileUploader';
import EvidenceList from '../../components/Evidences/EvidenceList';
import Separator from '../../components/Decorators/Separator';
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";

function EvidencesSection({ 
  handleSaveFiles,
  handleDelete,
  handleSelectionChange,
  evidenceFiles,
  testFiles,
  activePanel,
  setActivePanel,
  handleTabChange
}) {
  

  return (
    <div>
      <Separator text={'Evidences'} />
      <div className='flex items-center justify-center mt-8 mb-12'>
        <ToggleButton onSelectionChange={handleSelectionChange} />
      </div>

      {/* Contenu des onglets */}
      <div className="w-full flex-1 relative">
        <Tabs
          color="success"
          aria-label="Basic tabs"
          defaultValue={0}
          onChange={handleTabChange} // Ajout de l'événement onChange
          sx={{
            "--Tabs-spacing": "5px",
            "& .css-ed3i2m-JoyTabList-root": {
              backgroundColor: "transparent",
            },
          }}
        >
          <div className="flex justify-start">
            {/* Liens en haut */}
            <TabList className="w-full border-b">
              <Tab sx={{ "--Tab-indicatorThickness": "2px", paddingRight: '8px' }}>Evidences</Tab>
              <Tab sx={{ "--Tab-indicatorThickness": "2px" }}>Fiches de test</Tab>
            </TabList>
          </div>

          <div className="flex justify-center ml-2 mt-2">
            {/* Contenu des onglets */}
            <TabPanel value={0} className="h-full flex-1 w-full">
              <div style={{ overflow: "auto", maxHeight: "800px" }}>
                <div className='py-6'>
                  <FileUploader onSave={(formData) => handleSaveFiles(formData, activePanel)} />
                </div>
                <div className='flex flex-col items-center w-full my-6'>
                  <EvidenceList files={evidenceFiles} onDelete={handleDelete} />
                </div>
                {evidenceFiles.length === 0 && (
                  <p className="text-center text-gray-500 mt-4">Aucun evidence disponible.</p>
                )}
              </div>
            </TabPanel>

            <TabPanel value={1} className="h-full flex-1 w-full">
              <div style={{ overflow: "auto", maxHeight: "800px" }}>
                <div className='py-6'>
                  <FileUploader onSave={(formData) => handleSaveFiles(formData, activePanel)} />
                </div>
                <div className='flex flex-col items-center w-full my-6'>
                  <EvidenceList files={testFiles} onDelete={handleDelete} />
                </div>
                {testFiles.length === 0 && (
                  <p className="text-center text-gray-500 mt-4">Aucune fiche de test disponible.</p>
                )}
              </div>
            </TabPanel>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default EvidencesSection;
