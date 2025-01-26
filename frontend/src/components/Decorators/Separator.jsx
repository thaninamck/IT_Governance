import React from 'react';

const Separator = ({text="hola"}) => {
  return (
    <>
    <div className='flex items-center gap-4 m-1 p-2'>
      <p className='text-subfont-gray text-xl'>{text}</p>
    <div className='border-b border-[#DFE1E6] w-full '/>
    
    </div>


    </>
    
  );
};

export default Separator;