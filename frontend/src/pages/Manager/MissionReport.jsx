import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import Spinner from "../../components/Spinner";
import Header from "../../components/Header/Header";
import MissionInfo from "../../components/InfosDisplay/MissionInfo";
import { Progress } from "@material-tailwind/react";
import Breadcrumbs from "../../components/Breadcrumbs";
import useStatistics from "../../Hooks/useStatistics";
import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "../../Context/AuthContext";

const exportToPDF = (missionName = "Mission") => {
  const element = document.getElementById("report-content");
  const safeMission = missionName.replace(/\s+/g, "_");
  const dateStr = new Date().toISOString().slice(0, 10); // format YYYY-MM-DD

  html2pdf()
    .set({
      filename: `MissionReport_${safeMission}_${dateStr}.pdf`,
    })
    .from(element)
    .save();
};


const MissionReport = ({ missionId,missionName = "DSP" }) => {
  const dataApplication1 = [
    { name: "SNOC_APP", score: 87.8 },
    { name: "USSD_APP", score: 90.2 },
    { name: "Integration Layer_APP", score: 78 },
    { name: "CV360_APP", score: 89.9 },
    { name: "SIEM_APP", score: 79.1 },
    { name: "CSG_APP", score: 88.1 },
  ];
  const applications1 = [
    { name: "New SNOC", progress: 90 },
    { name: "USSD", progress: 25 },
    { name: "CV360°", progress: 10 },
    { name: "HITS", progress: 52 },
    { name: "FileNet", progress: 40 },
    { name: "Risk Manager", progress: 68 },
  ];
  const dataOS1 = [
    { name: "SNOC_OS", score: 87.8 },
    { name: "USSD_OS", score: 90.2 },
    { name: "Integration Layer_OS", score: 78 },
    { name: "CV360_OS", score: 89.9 },
    { name: "SIEM_OS", score: 79.1 },
    { name: "CSG_OS", score: 88.1 },
  ];
  const dataDatabase1 = [
    { name: "SNOC_DB", score: 84 },
    { name: "USSD_DB", score: 85.5 },
    { name: "Integration Layer_DB", score: 87 },
    { name: "CSG_DB (oracle)", score: 86.3 },
  ];
  const dataSYS1 = [
    { name: "SNOC_DB", score: 84 },
    { name: "USSD_DB", score: 85.5 },
    { name: "Integration Layer_DB", score: 87 },
    { name: "CSG_DB (oracle)", score: 86.3 },
  ];
  const dataLAYE1R = [
    { name: "OS", score: 84 },
    { name: "DB", score: 85.5 },
    { name: "APP", score: 87 },
  ];
  const { loading, error, missionStatistics } = useStatistics(missionId);
  const missionProgress = missionStatistics.mission_adv;

  const missionProgressValue = parseFloat(missionProgress); // au cas où c'est une string

const data =
  missionProgressValue >= 100
    ? [
        { name: "Progress", value: 100 },
        { name: "Remaining", value: 0.0001 }, // valeur très petite
      ]
    : [
        { name: "Progress", value: missionProgressValue },
        { name: "Remaining", value: 100 - missionProgressValue },
      ];

  
  const applications = missionStatistics.apps_adv;

  const COLORS = ["#FF6B00", "#EDEDED"]; // Couleur du progress + gris clair
  const dataApplication = missionStatistics.app;
  const dataOS = missionStatistics.os;
  const dataDatabase = missionStatistics.db;
  const dataSYS = missionStatistics.systeme;
  const dataLAYER = missionStatistics.layer;

  const pieData = [
    {
      name: "Pourcentage de conformité",
      value: missionStatistics.global_score,
      fill: "#4185F4",
    },
    {
      name: "Pourcentage de non conformité",
      value: 100 - missionStatistics.global_score,
      fill: "#F4B400",
    },
  ];

  const location = useLocation(); // Obtenir l'URL actuelle
  const navigate = useNavigate(); // Pour la navigation
  const { missionName: missionParam } = useParams(); // Récupérer le nom de la mission depuis l'URL

  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: "Missions", path: "/missions" },
    {
      label: missionParam || missionName,
      path: `/missions/${missionParam || missionName}`,
    },
  ]);
  const handleViewReport = (app) => {
    console.log("app",app)
    if (!app) {
      console.error("Application non définie !");
      return;
    }



    // Navigation vers l'URL de type /missions/DSP/app
    navigate(`/missions/${missionId}/appReport/${app.application_id}`, {
      state: { missionId:missionId , appData: app },
    });
  };

  const { user } = useAuth();
  return (
    <div className="">
      {/* <Header user={user} />

      <div className="my-3 mx-4">
        <Breadcrumbs routes={breadcrumbs} />
      </div> */}

<div className="flex justify-end mr-14">
  <button
  data-html2canvas-ignore
    onClick={() => exportToPDF(missionName)}
    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition"
  >
    <Download size={18} />
    PDF
  </button>
</div>
      <div id="report-content ">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
        <Spinner  size={50}/>
        </div>
        
        ) : (
          <>
            <h1 className="text-center text-3xl font-normal mt-5 mb-10">
              Rapport de mission
            </h1>

            
            {/* Mission Progress */}
            <div className="flex mt-16 flex-col lg:flex-row lg:justify-between lg:items-center gap-6 w-full px-4">
              {/* Bloc PieChart */}
              <div className="flex relative flex-col items-center justify-center bg-white shadow-sm rounded-lg p-6 w-full max-w-lg">
                <PieChart width={120} height={120}>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={50}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute text-xl font-bold mb-14">
                  {missionProgress}%
                </div>
                <p className="text-gray-700 font-medium">État de la mission</p>
                <p className="text-blue-500 font-medium">
                  {missionParam || missionName}
                </p>
              </div>

              {/* Liste des applications  */}
              <div
                className="w-full max-h-80 overflow-y-auto p-1 rounded-lg"
                data-html2canvas-ignore
              >
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                  {applications.map((app, index) => (
                    <div
                      key={index}
                      id={app.application_id}
                      className="flex flex-col sm:flex-row items-center gap-3 bg-white shadow-sm rounded-lg p-4 w-full max-w-md mx-auto"
                    >
                      {/* Label */}
                      <p className="text-gray-700 font-medium whitespace-nowrap">
                        {app.name}
                      </p>

                      {/* Progress Bar */}
                      <Progress
                        value={app.progress}
                        size="lg"
                        label="."
                        color="blue"
                        className="border border-[#E3E3E3] bg-[#F4F4F4] py-px flex-grow w-full"
                      />

                      {/* Bouton */}
                      <button
                        onClick={() => handleViewReport(app)}
                        className="border border-blue-600 text-[#0571CC] px-3 py-1 rounded whitespace-nowrap"
                      >
                        View Report
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Liste des graphes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mx-4 mt-24 mb-4">
              {/* Graphique Applications */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-center font-bold">
                  Score de conformité par application
                </h2>
                <ResponsiveContainer width="70%" height={200}>
                  <BarChart data={dataApplication}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#FFC000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Graphique Base de données */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-center font-bold">
                  Score de conformité par base de données
                </h2>
                <ResponsiveContainer width="70%" height={200}>
                  <BarChart data={dataDatabase}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#F4B183" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Graphique Systèmes d'exploitation */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-center font-bold">
                  Score de conformité par Systèmes d'exploitation
                </h2>
                <ResponsiveContainer width="70%" height={200}>
                  <BarChart data={dataOS}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#5687F2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Graphique Système */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-center font-bold">
                  Score de conformité global par système
                </h2>
                <ResponsiveContainer width="70%" height={200}>
                  <BarChart data={dataSYS}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#00B050" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Graphique Couhe */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-center font-bold">
                  Score de conformité global par couche
                </h2>
                <ResponsiveContainer width="70%" height={200}>
                  <BarChart data={dataLAYER}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#FFFF00" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Graphique Conformité / Non conformité */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-center font-bold">
                  Score de conformité / Non conformité
                </h2>
                <ResponsiveContainer width="70%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    />
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MissionReport;
