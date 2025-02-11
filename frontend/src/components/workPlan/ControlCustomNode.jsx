import React from 'react'

const ControlCustomNode = ({ data }) => {
    return (
      <div className="relative w-[350px] bg-white shadow-md rounded-lg border border-gray-300">
        {/* Ligne bleue en haut */}
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 rounded-t-lg"></div>
  
        <div className="flex p-4">
          {/* Section gauche avec le titre et l'ID */}
          <div className="flex flex-col items-start w-1/3 pr-2">
            <span className="text-gray-700 font-semibold">Controle</span>
            <span className="text-gray-400 text-sm">{data.id}</span>
          </div>
  
          {/* Section droite avec la description */}
          <div className="flex-1 bg-gray-100 p-3 rounded-lg text-gray-700 text-sm">
            {data.description}
          </div>
        </div>
      </div>
    );
  };
  
  export default ControlCustomNode;
  