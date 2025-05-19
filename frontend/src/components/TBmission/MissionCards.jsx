import React from 'react';
import {  buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import Control from './Control';
import { useNavigate } from 'react-router-dom';
import CircularProgressbarComponent from './CircularProgressbarComponent';
import BarProgressComponent from './BarProgressComponent';

dayjs.extend(duration);

function MissionCards({ data}) {

   const  controlData=[
        {id:"1", nom:"Commencé",pourcentage:`${data.controlCommencé.pourcentageTotale}`},
        {id:"2", nom:"Nom Commencé",pourcentage:`${data.controlNonCommencé}`},
        {id:"3", nom:"effective",pourcentage:`${data. controlEffctive}`},
        {id:"4", nom:"inéffective",pourcentage:`${data.controlNonEffective.pourcentageTotale}`}
    ]
    if (!data) return null;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/dashboard/${data.missionName}`,{ state: { missionData: data } });
    };
    
    // Données sur les contrôles
    const total = data.controls?.length || 0;
    const done = data.controls?.filter(c => c.status === 'done').length || 0;
    const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;


    return (
        <div  onClick={handleClick}
        className='border border-blue-500 p-4  shadow-md rounded-md flex flex-col gap-2  sm:w-[300px] md:w-[340px] lg:w-[240px] max-w-full'>
        
            <h3 className='text-center font-bold text-sm'>{data.missionName}</h3>
            <p className='text-xs  text-gray-600 text-center'>Client : {data.client}</p>
            <p className='text-xs text-gray-600 text-center'>Nombre de contrôles : {total}</p>

            {/* Avancement des contrôles */}
            <div className='flex justify-center items-center gap-2 mt-4'>
            <div className='w-14 h-14'>
                <CircularProgressbarComponent progressPercent={progressPercent}/>
                </div>
                <p className='text-xs text-center font-semibold'>Avancement de la mission</p>
            </div>
            {/* Barre temporelle */}
            <BarProgressComponent data={data} size="small"/>
            <div className='mt-2 '>
                <Control data={controlData} stopPropagation={true}/>
            </div>


        </div>
    );
}

export default MissionCards;
