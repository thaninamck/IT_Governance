import React, { useEffect, useMemo, useState } from "react";
import SideBar from "../../components/sideBar/SideBar";
import SideBarStdr from "../../components/sideBar/SideBarStdr";
import HeaderBis from "../../components/Header/HeaderBis";
import HeaderWithAction from "../../components/Header/HeaderWithAction";
import { useAuth } from "../../Context/AuthContext";
import html2pdf from "html2pdf.js";
import { Download } from "lucide-react";

import { useLocation } from "react-router-dom";
import CircularProgressbarComponent from "../../components/TBmission/CircularProgressbarComponent";
import BarProgressComponent from "../../components/TBmission/BarProgressComponent";
import Control from "../../components/TBmission/Control";
import RemediationActionData from "../../components/TBmission/RemediationActionData";
import MissionReport from "./MissionReport";
import { api } from "../../Api";
import { useDashboard } from "../../Hooks/useDashboard";
import Spinner from "../../components/Spinner";

function DashboardManager() {
  const { user, viewMode } = useAuth();
  const location = useLocation();
  const {
    missionReportData,
    loading,
    fetchMissionReport,
    executionData,
    fetchExecutionData,
    setSelectedExecution,
  } = useDashboard();
  const missionData = location.state?.missionData;

  console.log("mission Report data", missionReportData);
  console.log("mission  data", missionData);
  const [activeView, setActiveView] = useState("DB_Standard");
  useEffect(() => {
    if (missionData?.id) {
      fetchMissionReport(missionData.id);
    }
  }, [missionData?.id, fetchMissionReport]);

  const { progressPercent, controlData, statusControlData, RemédiationData } =
    useMemo(() => {
      if (!missionData || !missionReportData) return {};

      const pourcentageControlCommencé = missionReportData?.controlCommencé 
      const pourcentageControlEffective =missionReportData?.controlEffectif 
      const pourcentageControlNonEffective =missionReportData?.controlNonEffectif 
         
      const pourcentageControlNonCommencé = missionReportData?.controlNonCommencé 
      const total = missionReportData?.nbrControl || 0;
      const done = missionReportData?.controlFinalisé      || 0;
      const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

      const controlData = [
        {
          id: "1",
          nom: "Commencés",
          pourcentage: `${pourcentageControlCommencé}`,
        },
        {
          id: "2",
          nom: "non Commencés",
          pourcentage: `${pourcentageControlNonCommencé}`,
        },
        {
          id: "3",
          nom: "effectifs",
          pourcentage: `${pourcentageControlEffective}`,
        },
        {
          id: "4",
          nom: "ineffectifs",
          pourcentage: `${pourcentageControlNonEffective}`,
        },
      ];

      const statusControlData = [
        {
          id: "1",
          nom: "Applied",
          pourcentage: `${missionData?.controlEffectif}`,
        },
        {
          id: "2",
          nom: "Partially applied",
          pourcentage: `${missionData?.controlNonEffective?.partiallyApp}`,
        },
        {
          id: "3",
          nom: "Not applied",
          pourcentage: `${missionData?.controlNonEffective?.notApp}`,
        },
        {
          id: "4",
          nom: "Not tested",
          pourcentage: `${missionData?.controlNonEffective?.notTested}`,
        },
        {
          id: "5",
          nom: "Not applicable",
          pourcentage: `${missionData?.controlNonEffective?.notApplicable}`,
        },
      ];

      const RemédiationData = [
        {
          id: "1",
          nom: "Actions",
          pourcentage: `${missionReportData?.nbrAction}`,
        },
        {
          id: "2",
          nom: "Terminées",
          pourcentage: `${missionReportData?.actionTerminé}`,
        },
        {
          id: "3",
          nom: "En cours",
          pourcentage: `${missionReportData?.actionEnCours}`,
        },
      ];
      console.log("RemediationData", RemédiationData);
      return {
        progressPercent,
        controlData,
        statusControlData,
        RemédiationData,
      };
    }, [missionData, missionReportData]);

  if (!missionData) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  // if (loading || !missionReportData) {
  //     return <div><Spinner/></div>;
  // }
  const getColor = (nom) => {
    switch (nom?.toLowerCase()) {
      case "commencés":
        return "bg-yellow-100";
      case "nom commencés":
        return "bg-gray-300";
      case "effectifs":
        return "bg-green-100";
      case "ineffectifs":
        return "bg-red-200";
      case "actions":
        return "bg-yellow-200";
      case "terminées":
        return "bg-blue-200";
      case "en cours":
        return "bg-orange-200";
      case "applied":
        return "border-l-4 border-l-green-600";
      case "partially applied":
        return "border-l-4 border-l-orange-600";
      case "not applied":
        return "border-l-4 border-l-red-600";
      case "not tested":
        return "border-l-4 border-l-gray-600";
      case "not applicable":
        return "border-l-4 border-l-blue-600";

      default:
        return "bg-white";
    }
  };
//   const exportToPDF = async (missionName = "Mission") => {
//     const element = document.getElementById("report-content");
//     const safeMission = missionName.replace(/\s+/g, "_");
//     const dateStr = new Date().toISOString().slice(0, 10);
  
//     // Options pour améliorer la capture
//     const opt = {
//       margin: 10,
//       filename: `MissionReport_${safeMission}_${dateStr}.pdf`,
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { 
//         scale: 2, // Qualité plus élevée
//         useCORS: true,
//         scrollY: 0,
//         allowTaint: true,
//         logging: true, // Activez pour le débogage
//         ignoreElements: (el) => el.hasAttribute('data-html2canvas-ignore')
//       },
//       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//     };
  
//     // Force le rendu des éléments dynamiques
//     await new Promise(resolve => setTimeout(resolve, 500));
  
//     // Capture spécifique de la zone de contenu
//     const contentElement = element.querySelector('.flex-1.flex.flex-col.h-screen.overflow-y-auto');
    
//     try {
//       await html2pdf().set(opt).from(contentElement).save();
//     } catch (error) {
//       console.error("Erreur lors de la génération du PDF:", error);
//       // Fallback: essai avec l'élément complet si l'élément spécifique échoue
//       await html2pdf().set(opt).from(element).save();
//     }
//   };
const exportToPDF = async (missionName = "Mission") => {
    // Temporairement désactive le défilement et les éléments ignorés
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'visible';
    
    const ignoredElements = [...document.querySelectorAll('[data-html2canvas-ignore]')];
    ignoredElements.forEach(el => el.style.display = 'none');
  
    try {
      const element = document.getElementById("report-content");
      const safeMission = missionName.replace(/\s+/g, "_");
      const dateStr = new Date().toISOString().slice(0, 10);
  
      await html2pdf().from(element).set({
        filename: `MissionReport_${safeMission}_${dateStr}.pdf`,
        html2canvas: {
          scale: 2,
          scrollY: 0,
          ignoreElements: (el) => el.hasAttribute('data-html2canvas-ignore')
        }
      }).save();
    } finally {
      // Restaure l'état original
      document.body.style.overflow = originalOverflow;
      ignoredElements.forEach(el => el.style.display = '');
    }
  };
  return (
    <div id="report-content" className="flex">
         <div data-html2canvas-ignore >
      {user?.role === "admin" && viewMode === "admin" ? (
       

        
        <SideBar user={user} className="whitespace-nowrap" />
      ) : (
        <SideBarStdr user={user} className="whitespace-nowrap" />
        
      )}</div>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
       
       <div data-html2canvas-ignore>
       <HeaderBis />
        </div> 
        <div className="flex flex-row items-end pr-14 justify-between ">
          <HeaderWithAction
            title={`Mission ${missionReportData?.mission_name}`}
            user={user}
            bg_transparent={"bg-transparent"}
          />
          <div className="flex border-b-2 border-gray-300 mb-3 ml-8 ">
            <button
            data-html2canvas-ignore
              className={`px-2 py-2 ${
                activeView === "DB_Standard"
                  ? "rounded-l rounded-r-none border-none bg-gray-200 text-gray-700 "
                  : "rounded-none text-[var(--subfont-gray)] border-none "
              } `}
              onClick={() => setActiveView("DB_Standard")}
            >
              Standard
            </button>
            <button
            data-html2canvas-ignore
              className={`px-4 py-2 ${
                activeView === "DB_DSP"
                  ? " rounded-r rounded-l-none  border-none bg-gray-200 text-gray-700"
                  : "rounded-none text-[var(--subfont-gray)] border-none"
              } `}
              onClick={() => setActiveView("DB_DSP")}
            >
              DSP
            </button>
          </div>
        </div>
        <div  className="flex justify-end mr-14">
          <button
          data-html2canvas-ignore
            onClick={() => exportToPDF(missionReportData?.mission_name)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition"
          >
            <Download size={18} />
            PDF
          </button>
        </div>
        {activeView === "DB_Standard" &&
          (loading || !missionReportData ? (
            <div>
              <Spinner />
            </div>
          ) : (
            <>
              <div className="mt-4 flex flex-col md:flex-row  pb-6 px-10 gap-6">
                <div className="w-full md:w-[40%] flex flex-col justify-center items-center gap-2">
                  <div className="w-32 h-32">
                    <CircularProgressbarComponent
                      progressPercent={progressPercent}
                    />
                  </div>
                  <p className="text-l text-center font-semibold">
                    Avancement de la mission
                  </p>
                </div>
                <div className="w-full md:w-[55%] flex flex-col justify-center items-center gap-2">
                  <BarProgressComponent data={missionData} size="large" />
                </div>
              </div>

              {/*Control data*/}
              <div className=" px-16">
                <Control
                  data={controlData}
                  statusControl={missionData}
                  grid_cols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                />
              </div>
              {/*status Control data*/}
              <div className=" px-16 py-8">
                <h3 className="text-xl font-bold mb-4">Status Controles</h3>
                <Control
                  data={statusControlData}
                  statusControl={missionReportData}
                  grid_cols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2"
                />
              </div>
              {/*Remeddiation data*/}
              <div className="px-16 py-8">
                <h3 className="text-xl font-bold mb-4">Remédiation</h3>
                <div className="flex flex-wrap gap-6 justify-between">
                  {RemédiationData.map((item) =>
                    item.nom.toLowerCase() === "actions" ? (
                      <div
                        key={item.id}
                        className={`w-[250px] cursor-pointer flex flex-col justify-center items-center py-4  rounded shadow-sm hover:shadow-md transition duration-200 ${getColor(
                          item.nom
                        )}`}
                      >
                        <div
                          className={`flex  justify-center items-center gap-4`}
                        >
                          <p className="text-lg font-semibold">{item.nom}</p>
                          <span className="text-right font-semibold px-1 text-black text-l">
                            {item.pourcentage}
                          </span>
                        </div>
                        <span className="text-[12px]">
                          Réparties sur{" "}
                          <strong>
                            {missionReportData.nbrControlWithActions}
                          </strong>{" "}
                          controles
                        </span>
                      </div>
                    ) : (
                      <div
                        key={item.id}
                        className="w-[250px] flex  items-center justify-center gap-3 "
                      >
                        <div className="w-16 h-16">
                          <CircularProgressbarComponent
                            progressPercent={parseInt(item.pourcentage)}
                          />
                        </div>
                        <p className="text-center font-medium">{item.nom}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
              {/* Control Remédiation data*/}
              <div data-html2canvas-ignore className="px-1 pb-4 mb-8 ">
                <RemediationActionData
                  data={missionReportData}
                  getColor={getColor}
                />
              </div>
            </>
          ))}
        {activeView === "DB_DSP" && (
          <MissionReport
            missionId={missionData.id}
            missionName={missionData.missionName}
          />
        )}
      </div>
    </div>
  );
}

export default DashboardManager;
