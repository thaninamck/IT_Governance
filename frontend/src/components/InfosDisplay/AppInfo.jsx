import React, { useState, useEffect } from 'react'
import InfoDisplayComponent from './InfoDisplayComponent'

function AppInfo({ dataFormat }) {
  // Charger les données depuis localStorage si `dataFormat` n'est pas fourni
  const [appData, setAppData] = useState(() => {
    const savedData = localStorage.getItem("appData");
    return dataFormat || (savedData ? JSON.parse(savedData) : null);
  });

  // Sauvegarder `appData` dans localStorage à chaque mise à jour
  useEffect(() => {
    if (dataFormat) {
      localStorage.setItem("appData", JSON.stringify(dataFormat));
      setAppData(dataFormat);
    }
  }, [dataFormat]);

  // Vérifier si `appData` est défini pour éviter les erreurs
  if (!appData) {
    return <p className="text-red-500">Aucune donnée disponible</p>;
  }

  return (
    <div className="m-2 mb-8 overflow-x-scroll py-2 px-5 bg-white w-auto sm:w-auto sm:h-auto shadow-lg grid grid-cols-2 gap-x-3 gap-y-3 rounded-md">
      <InfoDisplayComponent
        label="Application"
        BoxContent={appData.nomApp || "Non défini"}
        borderWidth={300}
        labelWidth={150}
      />
      <InfoDisplayComponent
        label="Owner"
        BoxContent={appData.owner || "Non défini"}
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
        BoxContent={appData.contact || "Non défini"}
        borderWidth={300}
        labelWidth={150}
      />

      <div className="flex sm:flex-wrap gap-4 sm:gap-x-6">
        <label className='text-font-gray font-medium w-[24px] '>Couches</label>
        <div className="flex flex-col gap-2 items-start sm:items-center">
          {appData.couche && appData.couche.map((couche, index) => (
            <InfoDisplayComponent 
              key={index} 
              BoxContent={couche} 
              borderWidth="300px" 
              labelWidth="100px" 
              label="" 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AppInfo;
