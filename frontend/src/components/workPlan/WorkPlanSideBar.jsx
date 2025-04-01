import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import RiskAccordionItem from "./RiskAccordionItem";
import AppsAccordionItem from "./AppsAccordionItem";
import ControlAccordionItem from "./ControlAccordionItem";

const WorkPlanSideBar = ({
  onDragStart,
  onRiskDragStart,
  onControlDragStart,
}) => {
  // Exemple de structure avec ID et description
  const applications = [
    {
      id: "app1",
      description: "USSD",
      layers: [
        { id: "1", name: "OS" },
        { id: "2", name: "APP" },
      ],
      owner: "John Doe",
    },
    {
      id: "app2",
      description: "CV360",
      layers: [
        { id: "1", name: "OS" },
        { id: "4", name: "API" },
      ],
      owner: "John Doe",
    },
    {
      id: "app3",
      description: "CV360",
      layers: [
        { id: "3", name: "DB" },
        { id: "4", name: "API" },
      ],
      owner: "John Doe",
    },
  ];

  const risks = [
    { idRisk: "1", description: "alala ", nom: "alalal", code: "R12" },
    {
      idRisk: "2",
      description:
        "furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof",
      nom: "SDLC requirements are not exist or are not conducted.",
      code: "R12",
    },
    {
      idRisk: "3",
      description:
        "furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof",
      nom: "SDLC requirements are not exist or are not conducted.",
      code: "R12",
    },
    {
      idRisk: "4",
      description:
        "furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof",
      nom: "SDLC requirements are not exist or are not conducted.",
      code: "R12",
    },
  ];

  const controls = [
    {
      idCntrl: "1",
      description:
        "dada",
      majorProcess: "Technical",
      subProcess: "Acess control",
      type: "préventif",
      testScript:
        "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
      code: "C12",
    },
    {
      idCntrl: "2",
      description:
        "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification... ...",
      majorProcess: "Technical",
      subProcess: "Acess control",
      type: "détectif",
      testScript:
        "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
      code: "C12",
    },
    {
      idCntrl: "3",
      description:
        "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification... ...",
      majorProcess: "Technical",
      subProcess: "Acess control",
      type: "correctif",
      testScript:
        "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
      code: "C12",
    },
    {
      idCntrl: "4",
      description:
        "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification... ...",
      majorProcess: "Technical",
      subProcess: "Acess control",
      type: "préventif",
      testScript:
        "1. Obtain the access management policy,1.1. Ensure that the policy is validated, signed 2. Obtain HR list of departures during the.......",
      code: "C12",
    },
  ];

  const [searchApp, setSearchApp] = useState("");
  const filteredApps = applications.filter((app) =>
    app.description.toLowerCase().includes(searchApp.toLowerCase())
  );
  const [searchRisk, setSearchRisk] = useState("");
  const filteredRisks = risks.filter((risk) =>
    risk.description.toLowerCase().includes(searchRisk.toLowerCase())
  );

  const [searchControl, setSearchControl] = useState("");
  const filteredControls = controls.filter((control) =>
    control.description.toLowerCase().includes(searchControl.toLowerCase())
  );
  
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      {/* Bouton Toggle EN DEHORS de la sidebar pour ne pas disparaître */}
      <button
        className="fixed top-[12vh] left-5 z-50 bg-blue-nav border border-[#b4caeb] text-white p-2 rounded-full shadow-lg hover:bg-blue-menu transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar avec animation CSS */}
      <div
        className={`fixed top-[11vh] left-0 w-[25%] rounded-lg flex flex-col bg-blue-nav py-10 px-1 text-white min-h-screen shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="les_menus bg-white w-full max-w-md h-[78vh] mt-4 mx-auto rounded-lg p-1 overflow-auto ">
          <div className="flex flex-col gap-4">
            {/* Applications Section */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-[#152259] p-2 text-white font-medium flex justify-between items-center">
                <span>Applications</span>
              </div>
              <div className="p-2 bg-white">
                <input
                  type="text"
                  placeholder="Rechercher une application..."
                  value={searchApp}
                  onChange={(e) => setSearchApp(e.target.value)}
                  className="w-full p-2  border rounded text-gray-700 placeholder-subfont-gray"
                />
                <AppsAccordionItem
                  items={filteredApps}
                  onDragStart={onDragStart}
                />
              </div>
            </div>

            {/* Risks Section */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-[#f59e0b] p-2 text-white font-medium flex justify-between items-center">
                <span>Risques</span>
              </div>
              <div className="p-2 bg-white">
                <input
                  type="text"
                  placeholder="Rechercher un risque..."
                  value={searchRisk}
                  onChange={(e) => setSearchRisk(e.target.value)}
                  className="w-full p-2  border rounded text-gray-700 placeholder-subfont-gray"
                />
                <RiskAccordionItem
                  items={filteredRisks}
                  onDragStart={onRiskDragStart}
                />
              </div>
            </div>

            {/* Controls Section */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-[#3b82f6] p-2 text-white font-medium flex justify-between items-center">
                <span>Contrôles</span>
              </div>
              <div className="p-2 bg-white">
                <input
                  type="text"
                  placeholder="Rechercher un controle..."
                  value={searchControl}
                  onChange={(e) => setSearchControl(e.target.value)}
                  className="w-full p-2  border rounded text-gray-700 placeholder-subfont-gray"
                />
                <ControlAccordionItem
                  items={filteredControls}
                  onDragStart={onControlDragStart}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkPlanSideBar;