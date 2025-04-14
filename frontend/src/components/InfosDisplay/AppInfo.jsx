import React, { useState, useEffect } from 'react'
import InfoDisplayComponent from './InfoDisplayComponent'
import { api } from '../../Api';

function AppInfo({ dataFormat,appId }) {
  // Charger les données depuis localStorage si `dataFormat` n'est pas fourni
   const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const [appData, setAppData] = useState(() => {
    const savedData = localStorage.getItem("appData");
    return dataFormat || (savedData ? JSON.parse(savedData) : null);
  });

  // Sauvegarder `appData` dans localStorage à chaque mise à jour
  // useEffect(() => {
  //   if (dataFormat) {
  //     localStorage.setItem("appData", JSON.stringify(dataFormat));
  //     setAppData(dataFormat);
  //   }
  // }, [dataFormat]);

  // Fonction pour charger les données
     const fetchAppData = async () => {
      try {
        const response = await api.get(`/systems/${appId}`);
        console.log(response.data)
        setAppData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
     // Chargement initial
     useEffect(() => {
      if (appId) {
        fetchAppData();
      }
    }, [appId]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p className="text-red-500">Erreur: {error}</p>;
    if (!appData) return <p className="text-red-500">Aucune donnée disponible</p>;

  return (
    <div className="m-2 mb-8 overflow-x-scroll py-2 px-5 bg-white w-auto sm:w-auto sm:h-auto shadow-lg grid grid-cols-2 gap-x-3 gap-y-3 rounded-md">
      <InfoDisplayComponent
        label="Application"
        BoxContent={appData.systemName || "Non défini"}
        borderWidth={300}
        labelWidth={150}
      />
      <InfoDisplayComponent
        label="Owner"
        BoxContent={appData.ownerName || "Non défini"}
        borderWidth={300}
        labelWidth={150}
      />
      <InfoDisplayComponent
        label="Description"
        BoxContent={appData.description || "Non défini"}
        borderWidth={300}
        labelWidth={150}
      />
      <InfoDisplayComponent
        label="Contact"
        BoxContent={appData.ownerEmail || "Non défini"}
        borderWidth={300}
        labelWidth={150}
      />

      {/* <div className="flex sm:flex-wrap gap-4 sm:gap-x-6">
        <label className='text-font-gray font-medium w-[24px] '>Couches</label>
        <div className="flex flex-col gap-2 items-start sm:items-center">
          {appData.layers && appData.layers.map((layer, index) => (
            <InfoDisplayComponent 
              key={index} 
              BoxContent={layer.name} 
              borderWidth="300px" 
              labelWidth="100px" 
              label="" 
            />
          ))}
        </div>
      </div> */}
      <div className="col-span-2">
        <div className="flex  gap-2">
          <label className='text-font-gray font-medium'>Couches</label>
          <div className="flex flex-wrap gap-2">
            {appData.layers && appData.layers.map((layer, index) => (
              <div 
                key={layer.id} 
                className="px-3 py-1 bg-gray-100 rounded-md text-sm"
              >
                {layer.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppInfo;
