import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const RiskCustomNode = ({ data }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // État pour gérer la réduction du nœud

  return (
    <div
      className={`w-80 rounded-lg border shadow-md bg-white relative   
        ${isSelected ? "border-2 border-gray-900 border-dashed" : "border-gray-300"}`}
      onClick={() => setIsSelected(!isSelected)}
    >
      {/* Barre supérieure colorée avec bouton "-" */}
      <div className="bg-orange-500 h-8 flex items-center justify-between px-3 rounded-t-lg">
        <h3 className="text-black font-semibold text-sm">Risque</h3>
        <div
  className="text-black text-lg font-bold cursor-default outline-none focus:outline-none"
  onClick={(e) => {
            e.stopPropagation(); 
            setIsCollapsed(!isCollapsed);
          }}
        >
          {isCollapsed ? "+" : "-"}
        </div>
      </div>

      {/* Contenu affiché en mode réduit ou normal */}
      <div className="p-4">
        {/* Description toujours visible */}
        <div className="mt-2 bg-gray-100 p-2 rounded-lg text-sm text-gray-700">
          {data.riskData?.nom}
        </div>

        {/* Zone de drop cachée si réduit */}
        {!isCollapsed && (
          <div
            className={`p-4 border border-dashed transition-all duration-300 
            ${
              isDraggingOver
                ? "border-blue-200 bg-orange-500"
                : "mt-4 border-2 border-dashed border-orange-500 rounded-lg p-4 text-center text-gray-500 text-sm"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDraggingOver(true);
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(event) => {
              setIsDraggingOver(false);
              if (data.onControlDrop) data.onControlDrop(event);
            }}
          >
            Commencez à glisser vos contrôles ici
          </div>
        )}
      </div>

      {/* Connecteurs */}
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-blue-600" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-blue-600" />
    </div>
  );
};

export default RiskCustomNode;
