import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import WorkPlanSideBar from "../components/workPlan/WorkPlanSideBar";
import Flow from "../components/workPlan/Flow";
import { NotificationDialog } from "../components/workPlan/NotificationDialog";
import { ConfirmationDialog } from "../components/workPlan/ConfirmationDialog";
const Workplan = () => {
  const [appDuplicationDialogOpen, setappDuplicationDialogOpen] = useState(false);
  const [startWithriskDialogOpen, setstartWithriskDialogOpen] = useState(false);
  const [startWithCntrlDialogOpen, setstartWithCntrlDialogOpen] =useState(false);
  const [openConfirmationDialog, setopenConfirmationDialog] =useState(false);

  const [appNodes, setAppNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [existedAppVerified, setExistedAppVerified] = useState(false);
  const [dataStructure, setDataStructure] = useState({ applications: [] });
  const [application, setApplication] = useState({});
  const appEmpty = application?.id === undefined || application?.id === null;
  useEffect(() => {
    console.log("Nouvelle valeur de application:", application);
  }, [application]);//juste pour surveiller l'app

  
    // Charger l'état sauvegardé au montage
    useEffect(() => {
      const savedNodes = JSON.parse(window.localStorage.getItem("appNodes")) || [];
      const savedEdges = JSON.parse(window.localStorage.getItem("edges")) || [];
      const savedApp = JSON.parse(window.localStorage.getItem("application")) || {};
      console.log("savedNodes",savedNodes);
      setAppNodes(savedNodes);
      setEdges(savedEdges);
      setApplication(savedApp);
    }, []);
  
    // Sauvegarder l'état à chaque modification
    useEffect(() => {
      window.localStorage.setItem("appNodes", JSON.stringify(appNodes));
    }, [appNodes]);
  
    useEffect(() => {
      window.localStorage.setItem("edges", JSON.stringify(edges));
    }, [edges]);
  
    useEffect(() => {
      window.localStorage.setItem("application", JSON.stringify(application));
    }, [application]);
  
  

  
  const deleteItemsInApplication = (idsToDelete = []) => {
    if (!application) return;
  
    setApplication((prevApp) => {
      // Vérifier si l'application elle-même doit être supprimée
      if (idsToDelete.includes(prevApp.id)) {

        return {}; // Supprime toute l'application
      }
  
      // Filtrage des layers
      const filteredLayers = prevApp.layers
        .filter((layer) => !idsToDelete.includes(layer.id))
        .map((layer) => ({
          ...layer,
          risks: layer.risks
            .filter((risk) => !idsToDelete.includes(risk.id))
            .map((risk) => ({
              ...risk,
              controls: risk.controls.filter(
                (control) => !idsToDelete.includes(control.id)
              ),
            })),
        }));
  
  
      return  { ...prevApp, layers: filteredLayers };
    });
  };
  

  const addApplicationWithLayers = (id, description, layers) => {
    setApplication({
      id: id,
      description: description,
      owner:"",
      layers: layers.map((layer) => ({
        id: layer.id,
        name: layer.name,
        risks: [],
      })),
    });
  };

  // Fonction pour ajouter un risque dans une couche spécifique de l'application courante
  const addRiskToLayer = (idLayer, riskID,riskName, riskDescription) => {
    if (!application) return; // Vérifie qu'une application existe
    setApplication((prevApp) => ({
      ...prevApp,
      layers: prevApp.layers.map((layer) =>
        layer.id === idLayer
          ? {
              ...layer,
              risks: [
                ...layer.risks,
                { id: riskID,nom:riskName, description: riskDescription, owner:"",controls: [] },
              ],
            }
          : layer
      ),
    }));
  };

  const addControlToRisk = (idLayer, idRisk, cntrlID, cntrlDescription,majorProcess,subProcess,testScript) => {
    if (!application) return; // Vérifie qu'une application existe

    setApplication((prevApp) => ({
      ...prevApp,
      layers: prevApp.layers.map((layer) =>
        layer.id === idLayer
          ? {
              ...layer,
              risks: layer.risks.map((risk) =>
                risk.id === idRisk
                  ? {
                      ...risk,
                      controls: [
                        ...risk.controls,
                        { id: cntrlID, description: cntrlDescription,majorProcess:majorProcess,subProcess:subProcess,testScript:testScript,owner:"" },
                      ],
                    }
                  : risk
              ),
            }
          : layer
      ),
    }));

    console.log("lapplication", application);
  };

  const addToDataStructure = (application) => {
    console.log("Ajout de l'application :", application);

    setDataStructure((prevApp) => {
      const updatedStructure = {
        ...prevApp,
        applications: [...prevApp.applications, application],
      };

      console.log("Nouvelle structure :", updatedStructure);
      return updatedStructure;
    });
  };

  const onDragStart = (event, item) => {
    event.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  const onRiskDragStart = (event, item) => {
    console.log(item);
    event.dataTransfer.setData("application/json", JSON.stringify(item));
    console.log("risk dragged here");
  };

  const handleAddAppClick = () => {
    addToDataStructure(application);
    //setExistedAppVerified(false);
    setAppNodes([]);
    setEdges([])
    setApplication({})
  };

  const   handleopenConfirmationDialog  = () => {
    setopenConfirmationDialog(true)
    
  };
  const onRiskDrop = (event, layerId) => {
    event.preventDefault();
    const riskData = JSON.parse(event.dataTransfer.getData("application/json")); 

    const isRisk = riskData && "idRisk" in riskData;
    if (!isRisk) {
      //alert("Attention veuillez commencer par les risques !");
      setstartWithriskDialogOpen(true);
      return; // Bloque l'ajout
    }
    //console.log("le risque droppé", riskData);
    //console.log("le id risque", riskData.idRisk);
    //console.log("la desc risk", riskData.description);
    if (!layerId || !riskData) {
      console.warn("Layer ID or Risk Data not found");
      return;
    }
    addRiskToLayer(layerId, riskData.idRisk,riskData.nom, riskData.description);
    const x = event.clientX;
    const y = event.clientY;

    // Créer le nœud du risque
    const newRiskNode = {
      id: layerId+"_"+riskData.idRisk,
      type: "risk",
      position: { x, y },
      data: {
        riskData,
        onControlDrop: (event) =>
          onControlDrop(event, riskData.idRisk, layerId),
      },
    };

    // Créer l'edge entre la couche et le risque
    const newEdge = {
      id: `e-${layerId}-${layerId+"_"+riskData.idRisk}`,
      source: layerId,
      target: layerId+"_"+riskData.idRisk,
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

  const onControlDrop = (event, riskId, layerId) => {
    event.preventDefault();
    const controlData = JSON.parse(
      event.dataTransfer.getData("application/json")
    );
    const isCntrl = controlData && "idCntrl" in controlData;
    if (!isCntrl) {
      //alert("Attention veuillez mettre que les controles !");
      // <NotificationDialog message="Voulez-vous vraiment effectuer cette action ?" />
      setstartWithCntrlDialogOpen(true);
      return; // Bloque l'ajout
    }
    //console.log("le riskID", riskId);
    //console.log("le cntrl droppé", controlData);
    //console.log("le id cntrl", controlData.idCntrl);
    //console.log("le desc cntrl", controlData.description);
    if (!riskId || !controlData) {
      console.warn("not found");
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    // Créer le nœud du risque
    const newControlNode = {
      id: layerId+"_"+riskId+"_"+controlData.idCntrl,
      type: "cntrl",
      position: { x: x + 500, y: y + 5 * 100 },
      data: { controlData },
    };

    // Créer l'edge entre la couche et le risque
    const newEdge = {
      id: `e-${riskId}-${layerId+"_"+riskId+"_"+controlData.idCntrl}`,
      source: layerId+"_"+riskId,
      target: layerId+"_"+riskId+"_"+controlData.idCntrl,
      label: "",
    };

    // Mettre à jour les states
    setAppNodes((prevNodes) => [...prevNodes, newControlNode]);
    setEdges((prevEdges) => [...prevEdges, newEdge]);
    console.log(appNodes);
    addControlToRisk(
      layerId,
      riskId,
      controlData.idCntrl,
      controlData.description,
      controlData.majorProcess,
      controlData.subProcess,
      controlData.testScript,
    );
  };

  const onDrop = (event) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("application/json"));

    // Vérifier si une application existe déjà
    const isApp = data && "layers" in data && Array.isArray(data.layers);
    const hasApplication = appNodes.some((node) => node.type === "app");
    if (hasApplication && !appEmpty && isApp) {
      //alert("Une application est déjà présente dans le Flow !");

      setappDuplicationDialogOpen(true);
      //setExistedAppVerified(true);
      return; // Bloque l'ajout
    }

    //console.log("Ajout de l'application :", data);
    addApplicationWithLayers(data.id, data.description, data.layers);
    const x = event.clientX;
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
        onRiskDrop: (event) => onRiskDrop(event, layer.id),
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
    setAppNodes([newAppNode, ...layerNodes]); // Remplace plutôt qu'ajouter
    setEdges(newEdges);
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
              deleteItemsInApplication={deleteItemsInApplication}
            />
            <div className=" z-50 absolute bg-transparent bottom-0 right-0 w-auto h-auto ">
             
              <button
                className={
                  appEmpty
                    ? "hidden"
                    : "bg-blue-menu w-auto h-auto p-2 text-white mr-2 mb-2 hover:bg-blue-conf"
                }
                onClick={handleopenConfirmationDialog}
              >
                Ajouter
              </button>
            </div>
            <div className="relative   z-50 ">
              <WorkPlanSideBar
                onDragStart={onDragStart}
                onRiskDragStart={onRiskDragStart}
                onControlDragStart={onControlDragStart}
              />
            </div>
          </div>
        </div>
      </div>
      {appDuplicationDialogOpen && (
        <NotificationDialog
          message="Une application est déjà présente dans le Flow !"
          open={appDuplicationDialogOpen}
          setOpen={setappDuplicationDialogOpen}
        />
      )}

      {startWithriskDialogOpen && (
        <NotificationDialog
          message="Attention veuillez mettre des risques!"
          open={startWithriskDialogOpen}
          setOpen={setstartWithriskDialogOpen}
        />
      )}

      {startWithCntrlDialogOpen && (
        <NotificationDialog
          message="Attention veuillez mettre des risques!"
          open={startWithCntrlDialogOpen}
          setOpen={setstartWithCntrlDialogOpen}
        />
      )}

{openConfirmationDialog && (
        <ConfirmationDialog onConfirm={handleAddAppClick} open={openConfirmationDialog} setOpen={setopenConfirmationDialog} appname={application.description}/>
      )}


      <div className="bg-pink-50 min-h-screen text-center">
        {" "}
        ici la matrice baby{" "}
      </div>
    </main>
  );
};

export default Workplan;
