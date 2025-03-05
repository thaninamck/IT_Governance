import React from 'react'
import InfoDisplayComponent from './InfoDisplayComponent'

function AppInfo({dataFormat}) {
  return (
    <div className="m-2 mb-8  overflow-x-scroll py-2 px-5 bg-white w-auto sm:w-auto sm:h-auto shadow-lg grid grid-cols-2 gap-x-3 gap-y-3 rounded-md">
    <InfoDisplayComponent
      label="Application"
      BoxContent={dataFormat.nomApp|| "Non défini"}
      borderWidth={300}
      labelWidth={150}
    />
     <InfoDisplayComponent
      label="Owner"
      BoxContent={dataFormat.owner || "Non défini"}
      borderWidth={300}
      labelWidth={150}
    />
    <InfoDisplayComponent
      label="Description"
      BoxContent={dataFormat.description|| "Non défini"}
      borderWidth={300}
      labelWidth={150}
    />
   
    <InfoDisplayComponent
      label="Contact"
      BoxContent={dataFormat.contact|| "Non défini"}
      borderWidth={300}
      labelWidth={150}
    />
    <div className="flex   sm:flex-wrap gap-4 sm:gap-x-6">
        <label className='text-font-gray font-medium w-[24px] '>Couches</label>
        <div  className="flex flex-col  gap-2  items-start sm:items-center">
        {dataFormat.couche.map((couche, index) => (
         
            <InfoDisplayComponent 
              BoxContent={couche} 
              borderWidth="300px" 
              labelWidth="100px" 
              label="" 
            />
            
          
        ))}
        </div>
      </div>
    </div>
  )
}

export default AppInfo