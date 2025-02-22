import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";

const ControlCustomNode = ({ data }) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      className={`relative w-[350px] bg-white shadow-md rounded-lg  
        ${isSelected ? "border-2 border-gray-900 border-dashed" : "border border-gray-300"}`}
      onClick={() => setIsSelected(!isSelected)}
    >
      {/* Ligne bleue en haut */}
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 rounded-t-lg"></div>

      <div className="flex p-4">
        {/* Section gauche avec le titre et l'ID */}
        <div className="flex flex-col items-start w-1/3 pr-2">
          <span className="text-gray-700 font-semibold">Contrôle</span>
          <span className="text-gray-400 text-sm">{data.controlData.id}</span>
        </div>

        {/* Section droite avec la description */}
        <div className="flex-1 bg-gray-100 p-3 rounded-lg text-gray-700 text-sm">
          {data.controlData.description}
        </div>
      </div>

      {/* Connecteur */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-blue-600"
      />
    </div>
  );
};

export default ControlCustomNode;
