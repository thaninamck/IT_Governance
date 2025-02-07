import React, { useState } from "react";
import Header from "../components/Header/Header";
import WorkPlanSideBar from "../components/workPlan/WorkPlanSideBar";
import Flow from "../components/workPlan/Flow";
const Workplan = () => {
  const [appNodes, setAppNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onDragStart = (event, item) => {
    event.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  const onDrop = (event) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("application/json"));

    const x = event.clientX; // Position où on drop l'élément
    const y = event.clientY;

    // Créer le node principal (l'application)
    const newAppNode = {
      id: data.id,
      type: "custom",
      position: { x, y },
      data: { label: data.description },
    };

    // Créer les nodes pour chaque couche
    const layerNodes = data.layers.map((layer, index) => ({
      id: layer.id,
      type: "custom",
      position: { x: x + 500, y: y + index * 100 },
      data: { label: layer.name },
    }));

    // Créer les edges entre l'application et ses couches
    const newEdges = data.layers.map((layer) => ({
      id: `e-${data.id}-${layer.id}`,
      source: data.id,
      target: layer.id,
      label: "",
    }));

    // Mettre à jour les states
    setAppNodes((prevNodes) => [...prevNodes, newAppNode, ...layerNodes]);
    setEdges((prevEdges) => [...prevEdges, ...newEdges]);
  };

  const appSysNodes = [
    {
      id: "1",
      type: "custom",
      position: { x: 200, y: 150 },
      data: { label: "USSD" },
    },

    {
      id: "2",
      type: "custom",
      position: { x: 700, y: 50 },
      data: { label: "OS" },
    },
    {
      id: "3",
      type: "custom",
      position: { x: 700, y: 300 },
      data: { label: "APP" },
    },
  ];
  const appSysEdges = [
    { id: "e1-2", source: "1", target: "2", label: "Relation A-B" },
    { id: "e1-3", source: "1", target: "3", label: "Relation A-C" },
  ];
  return (
    <main className="min-h-screen">
      <div className="flex flex-col w-full bg-white min-h-screen overflow-hidden">
        {/* Header avec une hauteur de 15% */}
        <div className=" h-[11vh] flex-shrink-0 ">
          <Header />
        </div>

        {/* Contenu principal qui prend le reste */}
        <div className="w-full  ">
          
          <div
            className="relative w-full  flex my-2 flex-grow overflow-auto"
            onDragOver={(e) => e.preventDefault()} // Permet de drop
            onDrop={onDrop}
          >
            <Flow nodes={appNodes} edges={edges} />
            <div className="relative   z-50 ">
            <WorkPlanSideBar onDragStart={onDragStart} />
          </div>
          </div>
        </div>
      </div>

      <div className="bg-pink-50 min-h-screen text-center"> ici la matrice baby </div>
    </main>
  );
};

export default Workplan;
