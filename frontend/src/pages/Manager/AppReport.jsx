import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import html2pdf from "html2pdf.js";
import { useLocation } from 'react-router-dom';
import { Download } from "lucide-react";

import useStatistics from "../../Hooks/useStatistics";
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

const exportToPDF = (appName) => {
  const element = document.getElementById("report-content");
  const dateStr = new Date().toISOString().slice(0, 10); // format YYYY-MM-DD

  appName || "Application";
  html2pdf().set({ filename: `AppReport_${appName}_${dateStr}.pdf` }).from(element).save();
};


const AppReport = () => {
  const { state } = useLocation();

  const missionId = state?.missionId;
  const appData = state?.appData;


  const { loading, getAppReport } = useStatistics();
  const [data, setData] = useState(null);
  const [couches, setCouches] = useState([]);
  const [missionData, setMissionData] = useState({
    mission: "",
    client: "",
    owners: [],
    manager: "",
    applications: [],
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await getAppReport(missionId,appData.application_id);
        setData(response);

        // Mettre à jour les couches si elles existent dans la réponse
        if (response?.app.couches) {
          setCouches(response.app.couches);
        }

        // Mettre à jour les données de mission
        setMissionData((prev) => ({
          ...prev,
          mission: response?.app.mission || "Non spécifié",
          client: response?.app.client || "Non spécifié",
          owners: response?.app.owners || [],
          manager: response?.app.manager || "Non spécifié",
          applications: response?.app.applications || [],
        }));
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <>
        <Header user={user} />
        <div className="flex justify-center items-center h-screen">
          <div>Chargement en cours...</div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen ">
    <Header user={user} />
  
    <div className="flex justify-center sm:justify-end mx-4 sm:mx-8 mt-6">
  <button
    onClick={() => exportToPDF(appData.name)}
    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition"
  >
    <Download size={18} />
    PDF
  </button>
</div>
  
    <div
      id="report-content"
      className="p-6 sm:p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-2xl mt-6"
    >
      <header className="flex justify-between items-center border-b pb-4 mb-6">
        <img src="/mazars_logo.png" alt="Mazars Logo" className="h-10" />
      </header>
  
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-800">
        <div>
          <p><strong>Mission:</strong> {missionData.mission}</p>
          <p><strong>Client:</strong> {missionData.client}</p>
          <p><strong>Owner:</strong></p>
          <ul className="list-disc list-inside ml-2">
            {missionData.owners.map((owner, i) => (
              <li key={i}>{owner}</li>
            ))}
          </ul>
        </div>
  
        <div>
          {missionData.manager && (
            <p><strong>Manager:</strong> {missionData.manager}</p>
          )}
          <p>
            <strong>Application:</strong>{" "}
            {missionData.applications.length > 0
              ? missionData.applications.join(", ")
              : "Non spécifié"}
          </p>
        </div>
      </section>
  
      {couches.length > 0 ? (
        couches.map((couche, i) => (
          <section key={i} className="mt-10">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Couche {couche.nom}
            </h2>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="flex justify-center">
                <PieChart width={280} height={200}>
                  <Pie
                    data={couche.dataPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={50}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    {couche.dataPie.map((entry, j) => (
                      <Cell key={`cell-${j}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </div>
  
              <div className="flex flex-col items-center">
                <BarChart width={280} height={200} data={couche.dataBar}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
                <p className="text-sm mt-2 text-gray-600 text-center">
                  Nombre de contrôles non positionnés par owner
                </p>
              </div>
            </div>
          </section>
        ))
      ) : (
        <p className="text-center mt-10 text-gray-500">
          Aucune donnée de couche disponible.
        </p>
      )}
    </div>
  </div>
  );  
};

export default AppReport;
