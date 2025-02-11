import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AppCustomNode from "./AppCustomNode";
import RiskCustomNode from "./RiskCustomNode";
import LayerCustomNode from "./LayerCustomNode";
// Définition du type de nœud personnalisé
const nodeTypes = { 
  app: AppCustomNode, 
  risk: RiskCustomNode ,
  layer:LayerCustomNode
};

const Flow = ({ nodes, edges, setNodes, setEdges }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  // Sélection d'un nœud quand on clique dessus
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.id);
  }, []);

  // Suppression du nœud sélectionné + enfants en appuyant sur "Suppr"
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Delete" && selectedNode) {
        // Trouver les enfants du nœud sélectionné
        const childIds = edges
          .filter((edge) => edge.source === selectedNode) // Récupère tous les enfants du nœud sélectionné
          .map((edge) => edge.target); // Récupère leurs IDs

        // Liste complète des nœuds à supprimer (parent + enfants)
        const nodesToDelete = [selectedNode, ...childIds];

        // Filtrer les nœuds restants
        setNodes((nds) => nds.filter((n) => !nodesToDelete.includes(n.id)));

        // Filtrer les edges restants
        setEdges((eds) =>
          eds.filter((e) => !nodesToDelete.includes(e.source) && !nodesToDelete.includes(e.target))
        );

        setSelectedNode(null);
       
      }
    },
    [selectedNode, setNodes, setEdges, edges]
  );

  // Ajout de l'écouteur de touche "Suppr"
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ height: 560, width: 1280, backgroundColor: "white" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Flow;
