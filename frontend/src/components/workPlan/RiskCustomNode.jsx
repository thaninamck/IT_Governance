import React from "react";
import { Handle, Position } from '@xyflow/react';
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
const CustomNode = ({ data }) => {
  return (
    <div className="w-80 rounded-lg border shadow-md bg-white relative">
      {/* Barre supérieure colorée */}
      <div className="bg-orange-500 h-2 rounded-t-lg"></div>

      {/* Contenu du nœud */}
      <div className="p-4">
        <h3 className="text-gray-800 font-semibold text-lg">{data.title}</h3>

        {/* Description */}
        <div className="mt-2 bg-gray-100 p-2 rounded-lg text-sm text-gray-700">
          {data.description}
        </div>

        {/* Zone de drop */}
        <div className="mt-4 border-2 border-dashed border-blue-600 rounded-lg p-4 text-center text-gray-500 text-sm">
          Commencez à glisser vos contrôles ici
        </div>
      </div>

      {/* Connecteurs */}
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-blue-600" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-blue-600" />
    </div>
  );
};

export default CustomNode;
