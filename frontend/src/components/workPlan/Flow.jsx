import React, { useCallback, useEffect, useState } from "react";
import {
  MiniMap,
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AppCustomNode from "./AppCustomNode";
import RiskCustomNode from "./RiskCustomNode";
import LayerCustomNode from "./LayerCustomNode";
import ControlCustomNode from "./ControlCustomNode";

// Définition du type de nœud personnalisé
const nodeTypes = {
  app: AppCustomNode,
  risk: RiskCustomNode,
  layer: LayerCustomNode,
  cntrl: ControlCustomNode,
};

const Flow = ({
  nodes,
  deleteItemsInApplication,
  edges,
  setNodes,
  setEdges,
}) => {
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  // Sélection d'un nœud quand on clique dessus
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.id);
  }, []);

  // Fonction pour trouver tous les descendants d'un nœud
  const findAllDescendants = (nodeId, edges) => {
    const descendants = new Set();
    const stack = [nodeId];

    while (stack.length > 0) {
      const currentId = stack.pop();
      const children = edges
        .filter((edge) => edge.source === currentId)
        .map((edge) => edge.target);

      children.forEach((childId) => {
        if (!descendants.has(childId)) {
          descendants.add(childId);
          stack.push(childId);
        }
      });
    }

    return Array.from(descendants);
  };

  // Suppression du nœud sélectionné + enfants en appuyant sur "Suppr"
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Delete" && selectedNode) {
        // Trouver tous les descendants du nœud sélectionné
        const descendants = findAllDescendants(selectedNode, edges);

        // Liste complète des nœuds à supprimer (parent + descendants)
        const nodesToDelete = [selectedNode, ...descendants];

        // Appeler la fonction de suppression (si nécessaire)
        deleteItemsInApplication(nodesToDelete);

        // Filtrer les nœuds restants
        setNodes((nds) => nds.filter((n) => !nodesToDelete.includes(n.id)));

        // Filtrer les edges restants
        setEdges((eds) =>
          eds.filter(
            (e) =>
              !nodesToDelete.includes(e.source) &&
              !nodesToDelete.includes(e.target)
          )
        );

        // Réinitialiser la sélection
        setSelectedNode(null);
      }
    },
    [selectedNode, setNodes, setEdges, edges, deleteItemsInApplication]
  );

  // Ajout de l'écouteur de touche "Suppr"
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ height: "100vh", width: "100%", backgroundColor: "white" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
      >
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case "app":
                return "#152259";
              case "layer":
                return "#152259";
              case "risk":
                return "#FFA000";
              default:
                return "#0071FF";
            }
          }}
          nodeStrokeWidth={2}
        />

        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Flow;