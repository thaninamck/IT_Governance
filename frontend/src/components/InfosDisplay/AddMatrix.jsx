import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Matrix from '../workPlan/Matrix';
import { api } from '../../Api';

function AddMatrix({ user,missionId ,dataFormat}) {
  
  const [controleListe, setControleListe] = useState([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const handleAddMatrix = () => {
   // navigate(`/missions/${missionId}/Workplan`);
    navigate(`/missions/${missionId}/Workplan`);
  }

 // const [controleListe, setControleListe] = useState(data1);
  const handleRowClick = (rowData) => {
    console.log('Détails du contrôle sélectionné:', rowData);
  };


  useEffect(() => {
    const fetchMatrixData = async () => {
      try {
         const response = await api.get(`/missions/${missionId}/getmatrix`);
      //  console.log('resp',response.data)
        // setControleListe(mapToFrontendStructure(response.data));
        const rows = transformExecutionsToAppStructure(response.data);
       // console.log('data',rows)
        setControleListe(rows);
       // console.log('controle',controleListe)
      } catch (error) {
        console.error('Erreur lors de la récupération de la matrice :', error);
      } finally {
        setLoading(false);
      }
    };

    if (missionId) {
      fetchMatrixData();
    }
  }, [missionId]);

useEffect(()=>{
 // console.log('tstst',controleListe);
},[controleListe])


  function transformExecutionsToAppStructure(executions) {
    const applications = {};
  
    executions.forEach(exec => {
      const appId = exec.systemId;
      const layerId = exec.layerId;
      const riskId = exec.riskId;
      const controlId = exec.controlId;
      const executionId=exec.executionId;
  
      // Si l'application n'existe pas, on l'ajoute
      if (!applications[appId]) {
        applications[appId] = {
          id: appId,
          description: exec.systemName,
          owner: exec.systemOwner,
          layers: {},
        };
      }
  
      const app = applications[appId];
  
      // Si le layer n'existe pas, on l'ajoute
      if (!app.layers[layerId]) {
        app.layers[layerId] = {
          id: layerId,
          name: exec.layerName,
          risks: {},
        };
      }
  
      const layer = app.layers[layerId];
  
      // Si le risque n'existe pas, on l'ajoute
      if (!layer.risks[riskId]) {
        layer.risks[riskId] = {
          id: riskId,
          nom: exec.riskName,
          description: exec.riskDescription,
          owner: exec.riskOwner,
          code:exec.riskCode,
          controls: [],
        };
      }
  
      const risk = layer.risks[riskId];
  
      // Ajout du contrôle (tu peux dédupliquer ici si besoin)
      risk.controls.push({
        id: controlId,
        executionId: executionId,
        description: exec.controlDescription,
        majorProcess:exec.majorProcess, // à récupérer si disponible
        subProcess: "N/A", // idem
        code:exec.controlCode,
        type: exec.executionEffectiveness || "N/A",
        testScript: exec.executionRemark || "",
        owner: exec.executionControlOwner || "",
        testeur: exec.userFullName || "", 
      });
    });
  
    // Maintenant on convertit le map en tableau imbriqué
    return Object.values(applications).map(app => ({
      ...app,
      layers: Object.values(app.layers).map(layer => ({
        ...layer,
        risks: Object.values(layer.risks),
      })),
    }));
  }
  
  return (
    <div className="p-4 mb-1">
    <div className="flex items-center gap-2 mb-4">
      <PlusCircle className="text-[var(--blue-menu)] w-5 h-5" />
      <h2 className="text-l font-semibold text-[var(--blue-menu)]">Scope Contrôle</h2>
      <hr className="flex-grow border-t border-[var(--blue-menu)]" />
    </div>

    <div className="pl-6">
      {loading ? (
        <p>Chargement...</p>
      ) : controleListe && controleListe?.length > 0 ? (
        <>
          {(user?.role === 'admin') && (
            <div className='flex justify-end pr-5'>
              <button
                onClick={handleAddMatrix}
                className="px-4 py-2 border-none bg-[var(--blue-menu)] text-white text-sm font-medium rounded"
              >
                Modifier
              </button>
            </div>
          )}
          <Matrix data={{ applications: controleListe }} user={user} onRowClick={handleRowClick} fromScopeModification={true} lockModification={true} />
        </>
      ) : (
        <div className='flex flex-row items-center gap-4 pl-6'>
          <p className="text-[var(--status-gray)] text-s">
            Aucune matrice ajoutée pour le moment
          </p>
          {(user?.role === 'admin') && (
            <button
              onClick={handleAddMatrix}
              className="px-4 py-2 border-none bg-[var(--blue-menu)] text-white text-sm font-medium rounded"
            >
              Ajouter
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);
}

export default AddMatrix