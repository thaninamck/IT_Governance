import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
const AppsAccordionItem = ({ title, items, color, onDragStart }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border-pink-400">
      {/* Header de l'accordion */}
      <button
        className="flex items-start justify-between w-full p-1 mt-4 bg-white hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-start items-center">
          <span
            className="w-2 h-8 rounded-md mr-2"
            style={{ backgroundColor: color }}
          ></span>
          <span className="text-gray-900 font-medium">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp size={20} color="gray" />
        ) : (
          <ChevronDown size={20} color="gray" />
        )}
      </button>

      {/* Contenu déroulant */}
      <div
        className={`transition-all duration-300 overflow-auto ${
          isOpen ? "max-h-96 opacity-100 p-3" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="p-2 bg-white rounded-md text-gray-700  cursor-grab"
              draggable
              onDragStart={(e) => onDragStart(e, item)}
            >
              {item.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default AppsAccordionItem;
