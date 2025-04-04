import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import Breadcrumbs from "../../components/Breadcrumbs";
import html2pdf from "html2pdf.js";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useAuth } from "../../Context/AuthContext";

const missionData = {
  mission: "DSP",
  client: "Djezzy",
  owners: ["Soufiane Bouttaba", "Fayçal Mamri", "Farid Akbi"],
  manager: "Houda Elmouahab",
  applications: ["New SNOC"],
};

// Données dynamiques des différentes couches
const couches = [
  {
    nom: "Application",
    dataPie: [
      { name: "Applied", value: 22, color: "#3b82f6" },
      { name: "Not Tested", value: 12, color: "#22c55e" },
      { name: "In Implementation", value: 1, color: "#9333ea" },
      { name: "N/A", value: 21, color: "#ef4444" },
      { name: "Partially Applied", value: 4, color: "#f59e0b" },
      { name: "Not Applied", value: 13, color: "#f97316" },
      { name: "Not Positioned", value: 9, color: "#eab308" },
    ],
    dataBar: [
      { name: "Soufiane Bouttaba", value: 3 },
      { name: "Fayçal Mamri", value: 8 },
      { name: "Farid Akbi", value: 1 },
    ],
  },
  {
    nom: "Base de données",
    dataPie: [
      { name: "Applied", value: 15, color: "#3b82f6" },
      { name: "Not Tested", value: 8, color: "#22c55e" },
      { name: "In Implementation", value: 2, color: "#9333ea" },
      { name: "N/A", value: 18, color: "#ef4444" },
      { name: "Partially Applied", value: 6, color: "#f59e0b" },
      { name: "Not Applied", value: 10, color: "#f97316" },
      { name: "Not Positioned", value: 5, color: "#eab308" },
    ],
    dataBar: [
      { name: "Soufiane Bouttaba", value: 2 },
      { name: "Fayçal Mamri", value: 5 },
      { name: "Farid Akbi", value: 3 },
    ],
  },
  {
    nom: "Base de données",
    dataPie: [
      { name: "Applied", value: 15, color: "#3b82f6" },
      { name: "Not Tested", value: 8, color: "#22c55e" },
      { name: "In Implementation", value: 2, color: "#9333ea" },
      { name: "N/A", value: 18, color: "#ef4444" },
      { name: "Partially Applied", value: 6, color: "#f59e0b" },
      { name: "Not Applied", value: 10, color: "#f97316" },
      { name: "Not Positioned", value: 5, color: "#eab308" },
    ],
    dataBar: [
      { name: "Soufiane Bouttaba", value: 2 },
      { name: "Fayçal Mamri", value: 5 },
      { name: "Farid Akbi", value: 3 },
    ],
  },
  {
    nom: "Base de données",
    dataPie: [
      { name: "Applied", value: 15, color: "#3b82f6" },
      { name: "Not Tested", value: 8, color: "#22c55e" },
      { name: "In Implementation", value: 2, color: "#9333ea" },
      { name: "N/A", value: 18, color: "#ef4444" },
      { name: "Partially Applied", value: 6, color: "#f59e0b" },
      { name: "Not Applied", value: 10, color: "#f97316" },
      { name: "Not Positioned", value: 5, color: "#eab308" },
    ],
    dataBar: [
      { name: "Soufiane Bouttaba", value: 2 },
      { name: "Fayçal Mamri", value: 5 },
      { name: "Farid Akbi", value: 3 },
    ],
  },
];

const exportToPDF = () => {
  const element = document.getElementById("report-content"); // L'élément HTML à exporter

  html2pdf()
    .set({
      filename: "AppReport.pdf",
    })
    .from(element)
    .save();
};

const AppReport = () => {
  const location = useLocation(); // Récupérer l'objet location
  const appData = location.state?.appData; // Récupérer les données de la mission

  const decodedAppName = decodeURIComponent(appData?.name || "New SNOC");

  const { user} = useAuth();
  return (
    <div>
      <Header user={user} />
      <div className="my-3 mx-4">
        <Breadcrumbs />
      </div>

      {/* Titre et ligne horizontale */}
      <div className="flex flex-col sm:flex-row items-center mx-4 sm:mx-8 my-8 sm:my-16 pb-1">
        <h2 className="text-sm font-semibold text-gray-700 whitespace-nowrap">
          Rapport de l'application {decodedAppName}
        </h2>
        <div className="flex-1 border-b border-gray-300 ml-2 mt-2 sm:mt-0"></div>
      </div>

      {/* Bouton Exporter en PDF */}
      <div className="flex justify-center sm:justify-end mx-4 sm:mx-8">
        <button
          onClick={exportToPDF}
          className="bg-blue-menu text-white px-4 py-2 rounded-lg mb-8 sm:mb-0"
        >
          Exporter en PDF
        </button>
      </div>

      {/* Contenu du rapport */}
      <div
        id="report-content"
        className="p-4 sm:p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-auto"
      >
        {/* En-tête avec logo */}
        <header className="flex justify-between items-center border-b pb-4 mb-4">
          <img src="/mazars_logo.png" alt="Mazars Logo" className="h-8 sm:h-11" />
        </header>

        {/* Informations de la mission */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <strong>Mission:</strong> {missionData.mission}
            </p>
            <p>
              <strong>Client:</strong> {missionData.client}
            </p>
            <p>
              <strong>Owners:</strong>
            </p>
            <ul className="pl-4 list-disc">
              {missionData.owners.map((owner, index) => (
                <li key={index}>{owner}</li>
              ))}
            </ul>
          </div>
          <div>
            <p>
              <strong>Manager:</strong> {missionData.manager}
            </p>
            <p>
              <strong>Application:</strong> {missionData.applications.join(", ")}
            </p>
          </div>
        </section>

        {/* Boucle sur les couches dynamiques */}
        {couches.map((couche, index) => (
          <section key={index} className="mt-8">
            <h2 className="border-b pb-2 text-lg font-semibold">
              Couche {couche.nom}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {/* Graphique circulaire */}
              <div className="w-full sm:w-auto">
                <PieChart width={300} height={200}>
                  <Pie
                    data={couche.dataPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={50}
                    startAngle={90}
                    endAngle={-270}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {couche.dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend layout="vertical" align="left" verticalAlign="middle" />
                </PieChart>
              </div>

              {/* Graphique en barres */}
              <div className="w-full sm:w-auto">
                <BarChart width={300} height={200} data={couche.dataBar}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
                <p className="text-center mt-2 text-sm">
                  Nombre de contrôles non positionnés par owner
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default AppReport;