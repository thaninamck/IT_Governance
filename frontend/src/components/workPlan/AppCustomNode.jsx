import React, { useState } from "react";
import "@xyflow/react/dist/style.css";
import { Handle, Position } from "@xyflow/react";

const AppCustomNode = ({ data }) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      className={`w-80 rounded-lg border shadow-md bg-white relative cursor-pointer transition-all duration-200
        ${isSelected ? "border-2 border-dashed border-gray-800 " : "border-gray-300"}`}
      onClick={() => setIsSelected(!isSelected)}
    >
      {/* Barre supérieure colorée */}
      <div className="bg-blue-menu h-2 rounded-t-lg"></div>

      {/* Contenu du nœud */}
      <div className="p-4">
        {/* Description */}
        <div className="mt-2 p-2 rounded-lg text-sm font-bold text-black text-center">
          {data.label}
        </div>
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

export default AppCustomNode;
