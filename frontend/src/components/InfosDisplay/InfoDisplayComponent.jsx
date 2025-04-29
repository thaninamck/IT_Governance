import React from 'react';
import Box from '@mui/material/Box';


const InfoDisplayComponent = ({label,BoxContent,borderWidth,labelWidth}) => {
  return (
    <div 
      

      className='relative flex items-center justify-start '
    >
      {/* Label pour la mission */}
      <label 
        htmlFor={label} 
        
        className='text-font-gray font-medium  '
        style={{ width: labelWidth }}
      >
        {label} 
      </label>

      {/* Affichage du contenu */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderBottom: '1px solid #dcdcdc',
          width: borderWidth,
          marginBottom: '10px',
          wordBreak: "break-word", // Coupe les mots longs
          overflowWrap: "break-word", // Force le retour à la ligne
          whiteSpace: "pre-wrap", // Respecte les retours à la ligne et les espaces
         
         
        }}
      >
        <span 
          style={{ 
            fontSize: '13px', 
            color: '#555' ,
            
          }}
        >
          {BoxContent}
        </span>
      </Box>
    </div>
  );
};

export default InfoDisplayComponent;