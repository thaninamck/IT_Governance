import React, { useState, useEffect } from 'react';
import InfoDisplayComponent from './InfoDisplayComponent';
import { api } from '../../Api';

function AppInfo({ appId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appData, setAppData] = useState(null);

  const fetchAppData = async () => {
    try {
      const response = await api.get(`/systems/${appId}`);
      setAppData(response.data);
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors du chargement des données:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appId) {
      fetchAppData();
    }
  }, [appId]);

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

  if (!appData) return (
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
      <p className="text-xl font-semibold text-[var(--blue-menu)] mb-6">Informations de l'application</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InfoDisplayComponent
            label="Application"
            BoxContent={appData.systemName || "Non défini"}
            icon={
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            }
          />
          
          <InfoDisplayComponent
            label="Propriétaire"
            BoxContent={appData.ownerName || "Non défini"}
            icon={
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          
          <InfoDisplayComponent
            label="Description"
            BoxContent={appData.description || "Non défini"}
            icon={
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <InfoDisplayComponent
            label="Contact"
            BoxContent={appData.ownerEmail || "Non défini"}
            icon={
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        <div className="">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Couches</h3>
          <div className="flex flex-wrap gap-2">
            {appData.layers && appData.layers.map((layer) => (
              <span 
                key={layer.id} 
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800"
              >
                {layer.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppInfo;


// import React, { useState, useEffect } from 'react'
// import InfoDisplayComponent from './InfoDisplayComponent'
// import { api } from '../../Api';

// function AppInfo({ dataFormat,appId }) {
//   // Charger les données depuis localStorage si `dataFormat` n'est pas fourni
//    const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//   const [appData, setAppData] = useState(() => {
//     const savedData = localStorage.getItem("appData");
//     return dataFormat || (savedData ? JSON.parse(savedData) : null);
//   });

//   // Sauvegarder `appData` dans localStorage à chaque mise à jour
//   // useEffect(() => {
//   //   if (dataFormat) {
//   //     localStorage.setItem("appData", JSON.stringify(dataFormat));
//   //     setAppData(dataFormat);
//   //   }
//   // }, [dataFormat]);

//   // Fonction pour charger les données
//      const fetchAppData = async () => {
//       try {
//         const response = await api.get(`/systems/${appId}`);
//         console.log(response.data)
//         setAppData(response.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//      // Chargement initial
//      useEffect(() => {
//       if (appId) {
//         fetchAppData();
//       }
//     }, [appId]);

//     if (loading) return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );

//     if (error) return (
//       <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
//         <div className="flex">
//           <div className="flex-shrink-0">
//             <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <div className="ml-3">
//             <p className="text-sm text-red-700">Erreur: {error}</p>
//           </div>
//         </div>
//       </div>
//     );

//     if (!appData) return (
//       <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
//         <div className="flex">
//           <div className="flex-shrink-0">
//             <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <div className="ml-3">
//             <p className="text-sm text-blue-700">Aucune donnée disponible</p>
//           </div>
//         </div>
//       </div>
//     );

//   return (
//     <div className="m-2 mb-8 overflow-x-scroll py-2 px-5 bg-white w-auto sm:w-auto sm:h-auto shadow-lg grid grid-cols-2 gap-x-3 gap-y-3 rounded-md">
//       <InfoDisplayComponent
//         label="Application"
//         BoxContent={appData.systemName || "Non défini"}
//         borderWidth={300}
//         labelWidth={150}
//       />
//       <InfoDisplayComponent
//         label="Owner"
//         BoxContent={appData.ownerName || "Non défini"}
//         borderWidth={300}
//         labelWidth={150}
//       />
//       <InfoDisplayComponent
//         label="Description"
//         BoxContent={appData.description || "Non défini"}
//         borderWidth={300}
//         labelWidth={150}
//       />
//       <InfoDisplayComponent
//         label="Contact"
//         BoxContent={appData.ownerEmail || "Non défini"}
//         borderWidth={300}
//         labelWidth={150}
//       />

//       {/* <div className="flex sm:flex-wrap gap-4 sm:gap-x-6">
//         <label className='text-font-gray font-medium w-[24px] '>Couches</label>
//         <div className="flex flex-col gap-2 items-start sm:items-center">
//           {appData.layers && appData.layers.map((layer, index) => (
//             <InfoDisplayComponent 
//               key={index} 
//               BoxContent={layer.name} 
//               borderWidth="300px" 
//               labelWidth="100px" 
//               label="" 
//             />
//           ))}
//         </div>
//       </div> */}
//       <div className="col-span-2">
//         <div className="flex  mt-2 gap-2">
//           <label className='block text-s text-gray-500 mb-1 pl-3  font-medium w-full sm:w-[300px] mb-2 sm:mb-0' >Couches</label>
//           <div className="flex flex-wrap gap-2">
//             {appData.layers && appData.layers.map((layer, index) => (
//               <div 
//                 key={layer.id} 
//                 className="px-3 py-1 bg-gray-100 rounded-md text-sm"
//               >
//                 {layer.name}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AppInfo;

