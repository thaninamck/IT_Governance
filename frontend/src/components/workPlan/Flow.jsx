import React ,{ useState, useCallback } from 'react';
import  {ReactFlow, Controls, Background,applyNodeChanges, } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import RiskCustomNode from "./RiskCustomNode";
import AppCustomNode from "./AppCustomNode";

// Définition du type de nœud personnalisé
const nodeTypes = { custom: AppCustomNode };

const Flow = ({ nodes, edges }) => {
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  return (
    <div style={{ height: 560, width: 1280, backgroundColor: "white" }}>
      <ReactFlow  nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange}>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Flow;
