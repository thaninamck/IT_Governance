import React, { useState, useEffect } from "react";
import InfoDisplayComponent from "./InfoDisplayComponent";
import AddEquipe from "./AddEquipe";
import DisplayEquipe from "./DisplayEquipe";
import { api } from "../../Api";

// Material UI icons
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import EventIcon from '@mui/icons-material/Event';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
          <ErrorOutlineIcon className="text-red-500" />
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
          <InfoOutlinedIcon className="text-blue-500" />
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
            icon={<DescriptionIcon className="text-gray-500" />}
          />
          
          <InfoDisplayComponent
            label="Client"
            BoxContent={missionData.clientName || "Non défini"}
            icon={<BusinessIcon className="text-gray-500" />}
          />
          
          <InfoDisplayComponent
            label="Date début"
            BoxContent={missionData.start_date || "Non défini"}
            icon={<EventIcon className="text-gray-500" />}
          />
          
          <InfoDisplayComponent
            label="Date fin"
            BoxContent={missionData.end_date || "Non défini"}
            icon={<EventAvailableIcon className="text-gray-500" />}
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
            icon={<DateRangeIcon className="text-gray-500" />}
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
