import React from "react";
import Header from "../../components/Header/Header";
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

// Données dynamiques de la mission
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
];

const AppReport = () => {
  return (
    <div>
      <Header />

      <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
        <header className="flex justify-between items-center border-b pb-4 mb-4">
          <img src="/mazars_logo.png" alt="Mazars Logo" className="h-11" />
        </header>

        {/* Informations dynamiques de la mission */}
        <section className="grid grid-cols-2 gap-4 text-sm">
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
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Graphique circulaire */}
              <PieChart width={400} height={200}>
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

              {/* Graphique en barres */}
              <div>
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
