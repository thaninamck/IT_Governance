import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import RiskAccordionItem from "./RiskAccordionItem";
import AppsAccordionItem from "./AppsAccordionItem";
import ControlAccordionItem from "./ControlAccordionItem";

const WorkPlanSideBar = ({ onDragStart ,onRiskDragStart,onControlDragStart}) => {

// Exemple de structure avec ID et description
const applications = [
  { id: "app1", description: "USSD", layers: [{ id: "l1", name: "OS" }, { id: "l2", name: "APP" }] },
  { id: "app2", description: "CV360", layers: [{ id: "l3", name: "DB" }, { id: "l4", name: "API" }] },
  { id: "app3", description: "CV360", layers: [{ id: "l3", name: "DB" }, { id: "l4", name: "API" }] },

];

const risks = [
  { id: "1", description: "furfuzirfyzuf iuzyfoz ruozc furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof ojfyt yth iof " },
  { id: "2", description: "furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof" },
  { id: "3", description: "furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof" },
  { id: "4", description: "furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof furfuzirfyzuf iuzyfoz ruozc ojfyt yth iof" },

];

const controls = [
  { id: "4", description: "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification... ..." },
  { id: "5", description: "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification... ..." },
  { id: "6", description: "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification... ..."  },
  { id: "7", description: "Duties and areas of responsibility are separated, in order to reduce opportunities for unauthorized modification... ..."  },

];

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
        <div className="les_menus w-full max-w-md h-[78vh] mt-4 mx-auto rounded-lg p-1 overflow-auto bg-white">
         
        <AppsAccordionItem
            title="Applications"
            items={applications}
            color="#152259"
            onDragStart={onDragStart}
          />
         
          <RiskAccordionItem
            title="Risques"
            items={risks}
            color="#f59e0b"
            onDragStart={onRiskDragStart}
          />
          <ControlAccordionItem
            title="Contrôles"
            items={controls}
            color="#3b82f6"
            onDragStart={onControlDragStart}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkPlanSideBar;
