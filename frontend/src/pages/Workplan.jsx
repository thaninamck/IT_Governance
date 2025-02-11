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

  const onRiskDragStart = (event, item) => {
    event.dataTransfer.setData("application/json", JSON.stringify(item));
    console.log("risk dragged here");
  };
  const onRiskDrop = (event, layerId) => {
    event.preventDefault();
    const riskData = JSON.parse(event.dataTransfer.getData("application/json")); // ✅ Extraction correcte
    console.log("le risque droppé", riskData);
    console.log("le id risque", riskData.id);
    console.log("le desc risk", riskData.description);
    if (!layerId || !riskData) {
      console.warn("Layer ID or Risk Data not found");
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    // Créer le nœud du risque
    const newRiskNode = {
      id: riskData.id, // ✅ Correction ici
      type: "risk",
      position: { x, y },
      data: { riskData },
    };

    // Créer l'edge entre la couche et le risque
    const newEdge = {
      id: `e-${layerId}-${riskData.id}`,
      source: layerId,
      target: riskData.id,
      label: "",
    };

    // Mettre à jour les states
    setAppNodes((prevNodes) => [...prevNodes, newRiskNode]);
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  };

  const onControlDragStart = (event, item) => {
    event.dataTransfer.setData("application/json", JSON.stringify(item));
    console.log("control dragged here");
  };
  

  const onControlDrop = (event, layerId) => {
    event.preventDefault();
    const riskData = JSON.parse(event.dataTransfer.getData("application/json")); // ✅ Extraction correcte
    console.log("le risque droppé", riskData);
    console.log("le id risque", riskData.id);
    console.log("le desc risk", riskData.description);
    if (!layerId || !riskData) {
      console.warn("Layer ID or Risk Data not found");
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    // Créer le nœud du risque
    const newRiskNode = {
      id: riskData.id, // ✅ Correction ici
      type: "risk",
      position: { x, y },
      data: { riskData },
    };

    // Créer l'edge entre la couche et le risque
    const newEdge = {
      id: `e-${layerId}-${riskData.id}`,
      source: layerId,
      target: riskData.id,
      label: "",
    };

    // Mettre à jour les states
    setAppNodes((prevNodes) => [...prevNodes, newRiskNode]);
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  };



  const onDrop = (event) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("application/json"));

    const x = event.clientX; // Position où on drop l'élément
    const y = event.clientY;

    // Créer le node principal (l'application)
    const newAppNode = {
      id: data.id,
      type: "app",
      position: { x, y },
      data: { label: data.description },
    };

    // Créer les nodes pour chaque couche
    const layerNodes = data.layers.map((layer, index) => ({
      id: layer.id,
      type: "layer",
      position: { x: x + 500, y: y + index * 100 },
      data: {
        label: layer.name,
        onRiskDrop: (event) => onRiskDrop(event, layer.id), // ✅ Fonction bien transmise
      },
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
      type: "app",
      position: { x: 200, y: 150 },
      data: { label: "USSD" },
    },

    {
      id: "2",
      type: "layer",
      position: { x: 700, y: 50 },
      data: { label: "OS" },
    },
    {
      id: "3",
      type: "layer",
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
            <Flow
              nodes={appNodes}
              edges={edges}
              setNodes={setAppNodes}
              setEdges={setEdges}
            />
            <div className="relative   z-50 ">
              <WorkPlanSideBar
                onDragStart={onDragStart}
                onRiskDragStart={onRiskDragStart}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-pink-50 min-h-screen text-center">
        {" "}
        ici la matrice baby{" "}
      </div>
    </main>
  );
};

export default Workplan;
