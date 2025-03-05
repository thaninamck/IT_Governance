import React from 'react';

const Separator = ({ text }) => {
  return (
    <div className='relative w-full  my-4'>
      <div className='flex items-center  gap-2  '>
        <p className='text-subfont-gray  whitespace-nowrap text-l'>{text}</p>
        <div className='border-b border-[#DFE1E6] w-full ' />

      </div>
    </div>

  );
};

export default Separator;