import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import '../../index.css';

const PopUp = ({text,redirectionURL}) => {
  return (
    <div className=" rounded-lg w-1/3 h-auto bg-white drop-shadow-lg text-black
    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-4 p-6">
      
      <CheckCircleOutlineIcon sx={{ color: 'var(--success-green)', width: '65px', height: '77px' }} />
      
      <p className="sm:font-medium text-xs sm:text-2xl sm:text-font-gray">{text}</p>
      
      <a 
        href={redirectionURL} 
        className="bg-success-green w-full sm:w-2/3 h-auto py-1/2 sm:py-2 px-7 border border-1 border-transparent rounded-md text-white text-xs sm:text-xl block sm:flex items-center justify-center"
>
        Terminer
      </a>


      
    </div>
  );
};

export default PopUp;
