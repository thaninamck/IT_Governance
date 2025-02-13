import React, { useState } from "react";
import "@xyflow/react/dist/style.css";
import { Handle, Position } from "@xyflow/react";

const LayerCustomNode = ({ data }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      className={`w-80 rounded-lg shadow-md bg-white relative   
        ${isSelected ? "border-2 border-gray-900" : "border border-gray-300"}`}
      onClick={() => setIsSelected(!isSelected)}
    >
      {/* Barre supérieure colorée */}
      <div className="bg-blue-menu h-2 rounded-t-lg"></div>

      {/* Contenu du nœud */}
      <div className="p-4">
        <div className="mt-2 p-2 rounded-lg text-sm font-bold text-black text-center">
          {data.label}
        </div>
      </div>

      {/* Zone de drop */}
      <div
        className={`p-4 border border-dashed transition-all duration-300  m-3
          ${isDraggingOver ? "border-blue-200 bg-blue-menu" : "mt-4 border-2 border-dashed border-blue-menu rounded-lg p-4 text-center text-gray-500 text-sm"}`}
        onDragOver={(event) => {
          event.preventDefault(); // Permet le drop
          setIsDraggingOver(true); // Active l'effet visuel
        }}
        onDragLeave={() => setIsDraggingOver(false)} // Quand on quitte la zone
        onDrop={(event) => {
          setIsDraggingOver(false); // Réinitialise l'effet après le drop
          if (data.onRiskDrop) data.onRiskDrop(event); // Exécute la fonction de drop
        }}
      >
        Drop it here
      </div>

      {/* Connecteurs */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-blue-600"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-blue-600"
      />
    </div>
  );
};

export default LayerCustomNode;
