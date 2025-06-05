import React, { useState } from "react";

import ToggleButton from "../../components/ToggleButtons";
import FileUploader from "../../components/Evidences/FileUploader";
import EvidenceList from "../../components/Evidences/EvidenceList";
import Separator from "../../components/Decorators/Separator";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import { Margin } from "@mui/icons-material";

function EvidencesSection({
  handleSaveFiles,
  handleDelete,
  handleSelectionChange,
  evidenceFiles,
  testFiles,
  activePanel,
  setActivePanel,
  handleTabChange,
  selections,
  onStatesChange,
  getFile,
  deletingId,
  deletingTestId
}) {
  return (
    <div className="max-h-screen flex flex-col gap-4">
      <div className="mr-6  ml-6 ">
        <Separator text={"Evidences"} />
      </div>
      <div className="flex items-center justify-center  ">
        <ToggleButton selections={selections}
        onSelectionChange={handleSelectionChange}
        onStatesChange={onStatesChange} />
      </div>

      {/* Contenu des onglets */}
      <div className="w-full flex-1  p-5 relative   mb-3 ml-5 pr-14 ">
        <Tabs
          color="success"
          aria-label="Basic tabs"
          defaultValue={0}
          onChange={handleTabChange} // Ajout de l'événement onChange
          sx={{
           
              backgroundColor: "white",
              bgcolor:"white"
            
          }}
        >
          <div className="flex justify-center ">
            {/* Liens en haut */}
            <TabList className="w-full border-b"
           sx={{
            padding: "0",
            "& .MuiTab-root": {
              fontWeight: "600",
              textTransform: "capitalize",
              padding: "10px 20px",
              borderRadius: "8px 8px 0 0",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "var(--blue-nav)",
                color: "var(--blue-menu)",
              },
              "&[aria-selected='true']": {
                backgroundColor: "var(--blue-nav)",
                color: "var(--blue-menu)",
                borderBottom: "2px solid var(--blue-menu)",
              },
            },
          }}>
              <Tab
                sx={{ "--Tab-indicatorThickness": "2px", paddingRight: "8px",bgcolor:"white" }}
              >
                Evidences
              </Tab>
              <Tab sx={{ "--Tab-indicatorThickness": "2px" }}>
                Fiches de test
              </Tab>
            </TabList>
          </div>

          <div className="flex justify-center bg-white  ">
            {/* Contenu des onglets */}
            <TabPanel sx={{bgcolor:"white"}} value={0} className="h-full flex-1 bg-white max-h-80  overflow-auto  w-full" 
           >
             <div
            style={{
              overflow: evidenceFiles.length > 0 ? "auto" : "visible",
              maxHeight: evidenceFiles.length > 0 ? "800px" : "none"
            }}
          >
                <div className="py-6 ">
                  <FileUploader
                    onSave={(formData) =>
                      handleSaveFiles(formData, activePanel)
                    }
                    
                  />
                </div>
                <div className="flex flex-col items-center  w-full my-6">
                  <EvidenceList files={evidenceFiles} onDelete={handleDelete} getFile={getFile} deletingId={deletingId} />
                </div>
                {evidenceFiles.length === 0 && (
                  <p className="text-center text-gray-500 mt-4">
                    Aucun evidence disponible.
                  </p>
                )}
              </div>
            </TabPanel>

            <TabPanel value={1} className="h-full flex-1 w-full bg-white max-h-80  overflow-auto ">
            <div
            style={{
              overflow: testFiles.length > 0 ? "auto" : "visible",
              maxHeight: testFiles.length > 0 ? "800px" : "none"
            }}
          >
                <div className="py-6">
                  <FileUploader
                    onSave={(formData) =>
                      handleSaveFiles(formData, activePanel)
                    }
                  />
                </div>
                <div className="flex flex-col items-center w-full my-6">
                  <EvidenceList files={testFiles} onDelete={handleDelete} getFile={getFile} deletingId={deletingTestId}/>
                </div>
                {testFiles.length === 0 && (
                  <p className="text-center text-gray-500 mt-4">
                    Aucune fiche de test disponible.
                  </p>
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
