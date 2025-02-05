import React from "react";
import HeaderBis from "../components/Header/HeaderBis";
import SideBar from "../components/sideBar/SideBar";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Table from "../components/Table";
import { Button } from "@mui/material";
import { red } from "@mui/material/colors";

const ManageControls = () => {
  const columnsConfig = [
    { field: "code", headerName: "Code", width: 150 },
    { field: "control", headerName: "Contrôle", width: 400 },
    { field: "majorProcess", headerName: "Major Process", width: 180 },
    { field: "subProcess", headerName: "Sub Process", width: 180 },
    { field: "responsible", headerName: "Responsable", width: 200 },
    { field: "actions", headerName: "Actions", width: 180 },
  ];

  const rowsData = [
    {
      id: 1,
      code: "PIS.2201a",
      control: "Duties and areas of responsibility are separated...",
      majorProcess: "Technique",
      subProcess: "Physique",
      responsible: "Samy Rahem",
    },
    {
      id: 2,
      code: "PIS.2201b",
      control: "Periodic segregation of duties reviews are conducted...",
      majorProcess: "Technique",
      subProcess: "Physique",
      responsible: "Samy Rahem",
    },
    {
      id: 3,
      code: "71",
      control: "Access to sites and building is restricted...",
      majorProcess: "",
      subProcess: "",
      responsible: "Samy Rahem",
    },
    {
      id: 4,
      code: "1.1",
      control: "An information security strategy is developed regularly.",
      majorProcess: "",
      subProcess: "",
      responsible: "Samy Rahem",
    },
  ];

  return (
    <div className="flex flex-1 min-h-screen bg-[#fbfcfe]">
      {/* Barre latérale */}
      <div className="h-screen">
        <SideBar userRole={"admin"} />
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 p-6 bg-[#fbfcfe] min-h-screen overflow-hidden">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Référentiels</h1>
          <HeaderBis />
        </div>

        {/* Contenu des onglets */}
        <div className="w-full flex-1  relative   overflow-auto">
          <Tabs
            color="success"
            aria-label="Basic tabs"
            defaultValue={0}
            sx={{
              "--Tabs-spacing": "5px",
              "& .css-ed3i2m-JoyTabList-root": {
                backgroundColor: "transparent",
              },
            }}
          >
            <div className="flex  justify-start">
              {/* Liens en haut */}
              <TabList className="w-full border-b">
                <Tab sx={{ "--Tab-indicatorThickness": "2px" }}>Risques</Tab>
                <Tab sx={{ "--Tab-indicatorThickness": "2px" }}>Contrôles</Tab>
              </TabList>
            </div>

            {/* Boutons Importer CSV et Ajouter */}
            <div className="flex justify-end bg-transparent gap-4 p-4">
              <Button variant="outlined">Importer CSV</Button>
              <Button variant="contained">Ajouter un contrôle</Button>
            </div>

            <div className="flex justify-center ml-12 mt-12">
              {/* Contenu des onglets */}
              <TabPanel
                sx={{
                  "& .MuiTabPanel-root": {
                    backgroundColor: "transparent",
                  },
                }}
                value={0}
                className="h-full flex-1 w-full   overflow-auto"
              >
                <Table
                  columnsConfig={columnsConfig}
                  rowsData={rowsData}
                  checkboxSelection={false}
                  className="w-full "
                  sx={{
                    "& .MuiTabPanel-root": {
                      backgroundColor: "green",
                    },
                  }}
                />
              </TabPanel>

              <TabPanel
                sx={{
                  "& .MuiTabPanel-root": {
                    backgroundColor: "green",
                  },
                }}
                value={1}
                className="h-full flex-1 w-full overflow-auto"
              >
                <p>Contenu des risques à venir...</p>
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ManageControls;
