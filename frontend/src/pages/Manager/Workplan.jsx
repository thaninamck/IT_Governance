import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Matrix from "../../components/workPlan/Matrix";
import WorkPlanSideBar from "../../components/workPlan/WorkPlanSideBar";
import Flow from "../../components/workPlan/Flow";
import useWorkplan from "../../Hooks/useWorkplan";
import { NotificationDialog } from "../../components/workPlan/NotificationDialog";
import { ConfirmationDialog } from "../../components/workPlan/ConfirmationDialog";
import { useAuth } from "../../Context/AuthContext";
import { useLocation, useParams } from "react-router-dom";
const Workplan = () => {
  const location = useLocation();
  const {missionId} = useParams();
  useWorkplan(missionId);
  
  const [appDuplicationDialogOpen, setappDuplicationDialogOpen] =
    useState(false);
  const [startWithriskDialogOpen, setstartWithriskDialogOpen] = useState(false);
  const [startWithCntrlDialogOpen, setstartWithCntrlDialogOpen] =
    useState(false);
  const [openConfirmationDialog, setopenConfirmationDialog] = useState(false);
  const [openErrorDialog, setopenErrorDialog] = useState(false);
  const [layerWithoutControl, setlayerWithoutControl] = useState("");

  const [appNodes, setAppNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [existedAppVerified, setExistedAppVerified] = useState(false);
  const [dataStructure, setDataStructure] = useState({ applications: [] });
  const [application, setApplication] = useState({});
  const appEmpty = application?.id === undefined || application?.id === null;
  useEffect(() => {
    console.log("Nouvelle valeur de application:", application);
  }, [application]); //juste pour surveiller l'app

  // Charger l'état sauvegardé au montage
  // useEffect(() => {
  //   const savedNodes =
  //     JSON.parse(window.localStorage.getItem("appNodes")) || [];
  //   const savedEdges = JSON.parse(window.localStorage.getItem("edges")) || [];
  //   const savedApp =
  //     JSON.parse(window.localStorage.getItem("application")) || {};
  //   console.log("savedNodes", savedNodes);
  //   setAppNodes(savedNodes);
  //   setEdges(savedEdges);
  //   setApplication(savedApp);
  // }, []);
  useEffect(() => {
    const savedApp = JSON.parse(window.localStorage.getItem("application"));
    if (!savedApp || !savedApp.id) return;
  
    setApplication(savedApp);
  
    const reconstructedNodes = [];
    const reconstructedEdges = [];
  
    const appX = 335;
    const appY = 166;
    const GAP_X = 500;
    const GAP_Y = 220;
  
    // Node application
    reconstructedNodes.push({
      id: savedApp.id,
      type: "app",
      position: { x: appX, y: appY },
      data: { label: savedApp.description },
    });
  
    savedApp.layers?.forEach((layer, layerIndex) => {
      const layerX = appX + GAP_X;
      const layerY = appY + layerIndex * GAP_Y;
  
      // Node layer
      reconstructedNodes.push({
        id: layer.id,
        type: "layer",
        position: { x: layerX, y: layerY },
        data: {
          label: layer.name,
          onRiskDrop: (event) => onRiskDrop(event, layer.id),
        },
      });
  
      // Edge app → layer
      reconstructedEdges.push({
        id: `e-${savedApp.id}-${layer.id}`,
        source: savedApp.id,
        target: layer.id,
        label: "",
      });
  
      layer.risks?.forEach((risk, riskIndex) => {
        const riskNodeId = `${layer.id}_${risk.id}`;
        const riskX = layerX + 400;
        const riskY = layerY + riskIndex * 100;
  
        // Node risk
        reconstructedNodes.push({
          id: riskNodeId,
          type: "risk",
          position: { x: riskX, y: riskY },
          data: {
            riskData: risk,
            onControlDrop: (event) => onControlDrop(event, risk.id, layer.id),
          },
        });
  
        // Edge layer → risk
        reconstructedEdges.push({
          id: `e-${layer.id}-${riskNodeId}`,
          source: layer.id,
          target: riskNodeId,
          label: "",
        });
  
        risk.controls?.forEach((control, ctrlIndex) => {
          const controlNodeId = `${layer.id}_${risk.id}_${control.id}_${ctrlIndex}`;
          const controlX = riskX + 400;
          const controlY = riskY + ctrlIndex * 100;
  
          // Node control
          reconstructedNodes.push({
            id: controlNodeId,
            type: "cntrl",
            position: { x: controlX, y: controlY },
            data: { controlData: control },
          });
  
          // Edge risk → control
          reconstructedEdges.push({
            id: `e-${risk.id}-${controlNodeId}`,
            source: riskNodeId,
            target: controlNodeId,
            label: "",
          });
        });
      });
    });
  
    setAppNodes(reconstructedNodes);
    setEdges(reconstructedEdges);
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

      return { ...prevApp, layers: filteredLayers };
    });
  };

  const addApplicationWithLayers = (id, description, layers, owner) => {
    setApplication({
      id: id,
      description: description,
      owner: owner,
      layers: layers.map((layer) => ({
        id: layer.id,
        name: layer.name,
        risks: [],
      })),
    });
  };

  // Fonction pour ajouter un risque dans une couche spécifique de l'application courante
  const addRiskToLayer = (
    idLayer,
    riskID,
    riskName,
    riskDescription,
    riskCode
  ) => {
    if (!application) return; // Vérifie qu'une application existe

    setApplication((prevApp) => ({
      ...prevApp,
      layers: prevApp.layers.map((layer) =>
        layer.id === idLayer
          ? {
              ...layer,
              risks: layer.risks.some((risk) => risk.id === riskID)
                ? layer.risks // Ne rien ajouter si le risque existe déjà
                : [
                    ...layer.risks,
                    {
                      id: riskID,
                      nom: riskName,
                      code: riskCode,
                      description: riskDescription,
                      owner: "",
                      controls: [],
                    },
                  ],
            }
          : layer
      ),
    }));
  };

  const addControlToRisk = (
    idLayer,
    idRisk,
    cntrlID,
    cntrlDescription,
    majorProcess,
    subProcess,
    testScript,
    type,
    code
  ) => {
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
                      controls: risk.controls.some(
                        (control) => control.id === cntrlID
                      )
                        ? risk.controls // Ne rien ajouter si le contrôle existe déjà
                        : [
                            ...risk.controls,
                            {
                              id: cntrlID,
                              description: cntrlDescription,
                              majorProcess,
                              subProcess,
                              type,
                              testScript,
                              code,

                              owner: "",
                              executionId: "",
                              covId: "",
                            },
                          ],
                    }
                  : risk
              ),
            }
          : layer
      ),
    }));

    console.log("l'application mise à jour", application);
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

  const onRiskDragStart = (event, items) => {
    console.log(items);
    event.dataTransfer.setData("application/json", JSON.stringify(items));
    console.log("risks dragged here", items);
  };

  const handleAddAppClick = () => {
    const layerWithoutControl = application.layers.find((layer) =>
      layer.risks.every((risk) => risk.controls.length === 0)
    );

    if (layerWithoutControl) {
      setopenErrorDialog(true);
      setlayerWithoutControl(layerWithoutControl.name);

      //alert(`La couche '${layerWithoutControl.name}' n'a pas de contrôle. Veuillez en ajouter avant de continuer.`);
      return;
    }
    addToDataStructure(application);
    //setExistedAppVerified(false);
    setAppNodes([]);
    setEdges([]);
    setApplication({});
    };

  const handleopenConfirmationDialog = () => {
    setopenConfirmationDialog(true);
  };

  const onRiskDrop = (event, layerId) => {
    event.preventDefault();
    const risksData = JSON.parse(event.dataTransfer.getData("application/json"));
  
    if (!Array.isArray(risksData)) {
      console.warn("Dropped data is not an array of risks");
      return;
    }
  
    risksData.forEach((riskData, index) => {
      const isRisk = riskData && "idRisk" in riskData;
      if (!isRisk) {
        setstartWithriskDialogOpen(true);
        return;
      }
  
      if (!layerId || !riskData) {
        console.warn("Layer ID or Risk Data not found");
        return;
      }
  
      addRiskToLayer(
        layerId,
        riskData.idRisk,
        riskData.nom,
        riskData.description,
        riskData.code
      );
  
      const x = event.clientX + 900; // Décalé à droite de la couche
      const y = event.clientY + index * 100; // Empilement vertical
  
      const newRiskNode = {
        id: `${layerId}_${riskData.idRisk}`,
        type: "risk",
        position: { x, y },
        data: {
          riskData,
          onControlDrop: (event) =>
            onControlDrop(event, riskData.idRisk, layerId),
        },
      };
  
      const newEdge = {
        id: `e-${layerId}-${layerId}_${riskData.idRisk}`,
        source: layerId,
        target: `${layerId}_${riskData.idRisk}`,
        label: "",
      };
  
      setAppNodes((prevNodes) => [...prevNodes, newRiskNode]);
      setEdges((prevEdges) => [...prevEdges, newEdge]);
    });
  };
  
  

  const onControlDragStart = (event, item) => {
    event.dataTransfer.setData("application/json", JSON.stringify(item));
    console.log("control dragged here");
  };

  const onControlDrop = (event, riskId, layerId) => {
    event.preventDefault();
    let controlsData = JSON.parse(
      event.dataTransfer.getData("application/json")
    );
  
    console.log("Dropped data:", controlsData);
  
    if (!Array.isArray(controlsData)) {
      controlsData = [controlsData];
    }
  
    controlsData.forEach((controlData, index) => {
      const isCntrl = controlData && "idCntrl" in controlData;
      if (!isCntrl) {
        setstartWithCntrlDialogOpen(true);
        return;
      }
  
      if (!riskId || !controlData) {
        console.warn("Risk ID or Control Data not found");
        return;
      }
  
      const x = event.clientX + 1200; // à droite du risque
      const y = event.clientY + index * 100; // empilé verticalement
  
      const newControlNode = {
        id: `${layerId}_${riskId}_${controlData.idCntrl}_${index}`,
        type: "cntrl",
        position: { x, y },
        data: { controlData },
      };
  
      const newEdge = {
        id: `e-${riskId}-${layerId}_${riskId}_${controlData.idCntrl}_${index}`,
        source: `${layerId}_${riskId}`,
        target: `${layerId}_${riskId}_${controlData.idCntrl}_${index}`,
        label: "",
      };
  
      setAppNodes((prevNodes) => [...prevNodes, newControlNode]);
      setEdges((prevEdges) => [...prevEdges, newEdge]);
  
      addControlToRisk(
        layerId,
        riskId,
        controlData.idCntrl,
        controlData.description,
        controlData.majorProcess,
        controlData.subProcess,
        controlData.testScript,
        controlData.type,
        controlData.code
      );
    });
  };
  

  const onDrop = (event) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("application/json"));
  
    // Vérifier si une application existe déjà
    const isApp = data && "layers" in data && Array.isArray(data.layers);
    const hasApplication = appNodes.some((node) => node.type === "app");
    if (hasApplication && !appEmpty && isApp) {
      setappDuplicationDialogOpen(true);
      return;
    }
  
    addApplicationWithLayers(
      data.id,
      data.description,
      data.layers,
      data.owner
    );
  
    const x = event.clientX;
    const y = event.clientY;
    const GAP_X = 500; // distance horizontale entre app et couches
    const GAP_Y = 220; // distance verticale entre les couches
  
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
      position: { x: x + GAP_X, y: y + index * GAP_Y },
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
    setAppNodes([newAppNode, ...layerNodes]);
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

  const handleSaveexecutions = (data) => {
    console.log("Bouton cliqué dans l'enfant !", data);
  };
  const { user } = useAuth();
  return (
    <main className="min-h-screen">
      <div className="flex flex-col w-full bg-white min-h-screen overflow-hidden">
        {/* Header avec une hauteur de 15% */}
        <div className=" h-[11vh] flex-shrink-0 ">
          <Header user={user} />
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
                    : "border-none bg-blue-menu w-auto h-auto p-2 text-white mr-2 mb-2 hover:bg-blue-conf"
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

      {openErrorDialog && (
        <NotificationDialog
          message={`La couche '${layerWithoutControl}' n'a pas de contrôle. Veuillez en ajouter avant de continuer.`}
          open={openErrorDialog}
          setOpen={setopenErrorDialog}
        />
      )}

      {openConfirmationDialog && (
        <ConfirmationDialog
          onConfirm={handleAddAppClick}
          open={openConfirmationDialog}
          setOpen={setopenConfirmationDialog}
          appname={application.description}
        />
      )}

      <div className="bg-white  min-h-screen p-2 text-center">
        <Matrix
          data={dataStructure}
          user={user}
          handleSaveexecutions={handleSaveexecutions}
          fromScopeModification={false}
          unlockModification={true}
          viewOnly={false}
          missionId={missionId}
        ></Matrix>
      </div>
    </main>
  );
};

export default Workplan;