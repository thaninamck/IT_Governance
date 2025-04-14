import React, { useState, useEffect } from "react";
import InfoDisplayComponent from "./InfoDisplayComponent";
import AddEquipe from "./AddEquipe";
import DisplayEquipe from "./DisplayEquipe";
import { api } from "../../Api";

const MissionInfo = ({ dataFormat, user, missionId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [missionData, setMissionData] = useState();

  const fetchMissionData = async () => {
    try {
      const response = await api.get(`/missions/${missionId}/members`);
      setMissionData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (missionId) {
      fetchMissionData();
    }
  }, [missionId]);

  const handleTeamUpdate = () => {
    fetchMissionData();
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">Erreur: {error}</p>
        </div>
      </div>
    </div>
  );

  if (!missionData) return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">Aucune donnée disponible</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden py-2">
      <div className="px-6">
        <p className="text-xl font-semibold text-[var(--blue-menu)] mb-6">Informations de la mission</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InfoDisplayComponent
            label="Mission"
            BoxContent={missionData.mission_name || "Non défini"}
            icon={
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          
          <InfoDisplayComponent
            label="Client"
            BoxContent={missionData.clientName || "Non défini"}
            icon={
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          
          <InfoDisplayComponent
            label="Date début"
            BoxContent={missionData.start_date || "Non défini"}
            icon={
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          
          <InfoDisplayComponent
            label="Date fin"
            BoxContent={missionData.end_date || "Non défini"}
            icon={
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        <div className="mb-8">
          <InfoDisplayComponent
            label="Période auditée"
            BoxContent={
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Du</span>
                <span className="font-medium">{missionData.auditStartDate || "Non défini"}</span>
                <span className="text-gray-600">au</span>
                <span className="font-medium">{missionData.auditEndDate || "Non défini"}</span>
              </div>
            }
            icon={
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
        </div>

        <div className=" pt-1">
          
          <DisplayEquipe 
            equipe={missionData.members}
            missionId={missionData.id}
            user={user}
            onTeamUpdate={handleTeamUpdate}
          />
        </div>

        {(user?.role === "admin" || dataFormat.profileName === "manager") && (
          <div className="mt-6">
            <AddEquipe  
              missionId={missionData.id}
              onMemberAdded={handleTeamUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionInfo;