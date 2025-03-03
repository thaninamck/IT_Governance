import React from 'react';
import InfoDisplayComponent from './InfoDisplayComponent';

const DisplayEquipe = ({ equipe }) => {


  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center mt-4">
      <label htmlFor="Equipe" className="text-font-gray font-medium w-full sm:w-[300px] mb-2 sm:mb-0">
        Équipe:
      </label>

      <div className="flex flex-col  sm:flex-wrap gap-4 sm:gap-x-6">
        {equipe.map((membre, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-start sm:items-center">
            <InfoDisplayComponent 
              BoxContent={membre.membre} 
              borderWidth="220px" 
              labelWidth="100px" 
              label="Membre:" 
            />
            <InfoDisplayComponent 
              BoxContent={membre.role} 
              borderWidth="120px" 
              labelWidth="100px" 
              label="Rôle:" 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DisplayEquipe;
