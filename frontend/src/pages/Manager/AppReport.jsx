import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import html2pdf from "html2pdf.js";
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

const exportToPDF = () => {
  const element = document.getElementById("report-content");
  html2pdf().set({ filename: "AppReport.pdf" }).from(element).save();
};

const AppReport = () => {
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
        const response = await getAppReport(1);
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
    <div>
      <Header user={user} />

      <div className="flex justify-center sm:justify-end mx-4 sm:mx-8">
        <button
          onClick={exportToPDF}
          className="bg-blue-menu text-white px-4 py-2 rounded-lg mb-8 sm:mb-0"
        >
          Exporter en PDF
        </button>
      </div>

      <div
        id="report-content"
        className="p-4 sm:p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-auto"
      >
        <header className="flex justify-between items-center border-b pb-4 mb-4">
          <img
            src="/mazars_logo.png"
            alt="Mazars Logo"
            className="h-8 sm:h-11"
          />
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <strong>Mission:</strong> {missionData.mission}
            </p>
            <p>
              <strong>Client:</strong> {missionData.client}
            </p>
            <p>
              <strong>Owner:</strong>
            </p>
            <ul className="pl-4 list-disc">
              {missionData.owners.map((owner, index) => (
                <li key={index}>{owner}</li>
              ))}
            </ul>
          </div>
          <div>
            {missionData.manager && (
              <p>
                <strong>Manager:</strong> {missionData.manager}
              </p>
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
          couches.map((couche, index) => (
            <section key={index} className="mt-8">
              <h2 className="border-b pb-2 text-lg font-semibold">
                Couche {couche.nom}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
                      {couche.dataPie.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={entry.color} />
                      ))}
                    </Pie>
                    {/* 👉 Ajoute le Tooltip ici */}
                    <Tooltip />
                    <Legend
                      layout="vertical"
                      align="left"
                      verticalAlign="middle"
                    />
                  </PieChart>
                </div>

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
          ))
        ) : (
          <p className="text-center mt-8 text-sm">
            Aucune donnée de couche disponible
          </p>
        )}
      </div>
    </div>
  );
};

export default AppReport;
