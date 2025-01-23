import React from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SingleOptionSelect from '../Selects/SingleOptionSelect';
import InfoDisplayComponent from './InfoDisplayComponent';
import { TurnSharpLeft } from '@mui/icons-material';

const DisplayEquipe = ({equipe}) => {
  // Exemple de liste d'équipes attendue
  /*const equipes = [
    { membre: "houda", role: "Manager" },
    { membre: "membre2", role: "Testeur" },
    { membre: "membre3", role: "Superviseur" },
  ];*/
  const equipes = equipe;

  return (
    <div className="flex items-center mt-4">
      <label htmlFor="Equipe" className="text-font-gray font-medium w-[300px]">
        Équipe:
      </label>

      
        <div className='flex flex-col gap-x-2 items-center'>
          

          {/* Itération sur la liste des équipes */}
          {equipes.map((membre, index) => (
            <div key={index} className='flex gap-x-14 items-center'>
              <InfoDisplayComponent BoxContent={membre.membre} borderWidth={220} labelWidth={100} label={"Membre:"} />
              <InfoDisplayComponent BoxContent={membre.role} borderWidth={90} labelWidth={70} label={"Role:"} />
            </div>
          ))}
        </div>
      
    </div>
  );
}

export default DisplayEquipe;