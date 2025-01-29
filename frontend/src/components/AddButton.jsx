import React, { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function AddButton({title,onClick }) {

    
  return (
    <div className='flex gap-x-2 items-center '  onClick={onClick}>
    <AddCircleOutlineIcon
      sx={{ color: 'var(--blue-menu)', width: '30px', height: '30px', cursor: 'pointer' }}
     
    />
    <p className="text-blue-menu text-base font-medium">{title}</p>
  </div>
  )
}

export default AddButton