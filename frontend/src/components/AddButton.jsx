import React, { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function AddButton({title,onClick }) {

    
  return (
    <div className='flex gap-x-2 items-center  mt-9 '  onClick={onClick}>
    <AddCircleOutlineIcon
      sx={{ color: 'var(--blue-menu)', width: '20px', height: '20px', cursor: 'pointer' }}
     
    />
    <p className="text-blue-menu text-base font-medium text-xs">{title}</p>
  </div>
  )
}

export default AddButton