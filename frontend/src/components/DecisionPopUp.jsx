import React ,{useState} from 'react'
import '../index.css';
import CloseIcon from '@mui/icons-material/Close';


const DecisionPopUp = ({text,confirmURL,denyURL}) => {
    const [open, setOpen] = useState(true)

    const handleCloseDecisionPopUp = () => {
        setOpen(false)
    }



  return (
   open && (

    <div
    
    className=" rounded-lg w-auto h-auto bg-white drop-shadow-lg text-black
    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col  justify-around  gap-4 p-6">
        <div onClick={handleCloseDecisionPopUp}
         className='absolute top-0 right-0 bg-[#E5E5E5] rounded-full text-blue mr-1 '>
            <CloseIcon sx={{ color: '#4F4F4F', width: '12px', height: '12px' }} className='mx-1'/>
        </div>
        <h2 className='w-auto h-auto text-blue-menu text-xl font-semibold sm:text-xs'>{text}</h2>
        
        
        <div className='flex gap-4  mt-5 relative max-sm:flex-col justify-center align-bottom items-baseline '>

        <a 
        href={denyURL} 
        className="bg-transparent border border-1 border-blue-menu w-auto h-auto sm:px-6 py-2 px-8   rounded-md text-blue-menu text-xs flex items-center justify-center">
        Non, Annuler
      </a>

      <a 
        href={confirmURL} 
        className=" bg-blue-conf w-auto h-auto py-2 px-8   rounded-md text-white text-xs flex items-center justify-center">
        Non, Annuler
      </a>

        </div>
        </div>
   )
  )
}

export default DecisionPopUp