
import React from 'react';
import { Box } from '@mui/material';

const InfoDisplayComponent = ({ label, BoxContent, icon }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-1">
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <label htmlFor={label} className="block text-sm font-medium text-gray-500 mb-1">
          {label}
        </label>
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            minHeight: '1.7rem',
            padding: ' 0',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <span className="text-sm text-gray-800 font-medium">
            {BoxContent}
          </span>
        </Box>
      </div>
    </div>
  );
};

export default InfoDisplayComponent;
