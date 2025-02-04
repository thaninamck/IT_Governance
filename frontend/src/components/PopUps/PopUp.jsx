import React from 'react';
import Separator from '../Decorators/Separator.jsx';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import '../../index.css';

const PopUp = ({text,redirectionURL}) => {
  return (
    <div className=" rounded-lg w-1/3 h-auto bg-white drop-shadow-lg text-black
     flex flex-col items-center justify-center gap-3 p-6 space-y-7">
      
      <CheckCircleOutlineIcon sx={{ color: 'var(--success-green)', width: '79px', height: '77px' }} />
      
      <p className="font-medium text-2xl text-font-gray">{text}</p>
      
      {/*<a 
        href={redirectionURL} 
        className="bg-success-green w-2/3 h-auto py-2 px-7 border border-1 border-transparent rounded-md text-white text-xl flex items-center justify-center"
>
        Terminer
      </a>*/}
      <button
        onClick={redirectionURL}
        className="bg-success-green w-2/3 h-auto py-2 px-7 border border-1 border-transparent rounded-md text-white text-xl flex items-center justify-center"
      >
        Terminer
      </button>


      
    </div>
  );
};

export default PopUp;
