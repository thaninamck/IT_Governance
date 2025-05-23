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

function MissionCards({ data,size = 'medium'}) {
 
 const pourcentageControlCommencé =  Math.round((data?.controlCommencé?.nbrTotale/data?.nbrControl)*100)
    const  controlData=[
        {id:"1", nom:"Commencé",pourcentage:`${pourcentageControlCommencé}`},
        {id:"2", nom:"non Commencé",pourcentage:`${data?.controlNonCommencé}`},
        {id:"3", nom:"effective",pourcentage:`${data?.controlEffectif }`},
        {id:"4", nom:"ineffective",pourcentage:`${data?.controlNonEffective?.pourcentageTotale}`}
    ]
    if (!data) return null;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/dashboard/${data.missionName}`,{ state: { missionData: data } });
    };
    
    // Données sur les contrôles
    const total = data.nbrControl || 0;
    const done = data.controlCommencé?.nbrFinalisé || 0;
    const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

    const sizeStyles = {
        small: {
            text: 'text-[12px]',
            SousText:'text-[12px]',
            Wcercle:'w-12',
            Hcercle:'h-12',
            barHeight: 'h-[4px]',
            barContainerWidth: 'w-[60%]',
            dateText: 'text-[10px]',
        },
        medium: {
            text: 'text-[16px]',
            SousText:'text-[14px]',
            Wcercle:'w-14',
            Hcercle:'h-14',
            barHeight: 'h-[5px]',
            barContainerWidth: 'w-[70%]',
            dateText: 'text-xs',
        },
        large: {
            text: 'text-[18px]',
            SousText:'text-[14px]',
            Wcercle:'w-20',
            Hcercle:'h-20',
            barHeight: 'h-[12px]',
            barContainerWidth: 'w-full',
            dateText: 'text-sm',
        }
    };
    const styles = sizeStyles[size] || sizeStyles.medium;

    return (
        <div  onClick={handleClick}
        className='border border-blue-500 p-4  shadow-md rounded-md flex flex-col gap-2  sm:w-[300px] md:w-[340px] lg:w-[300px] max-w-full'>
        
            <h3 className={`text-center font-bold ${styles.text}`}>{data?.missionName}</h3>
            <p className={`${styles.SousText}  text-gray-600 text-center`}>Client : {data?.client}</p>
            <p className={`${styles.SousText} text-gray-600 text-center`}>Nombre de contrôles : {data?.nbrControl}</p>

            {/* Avancement des contrôles */}
            <div className='flex justify-center items-center gap-2 mt-4'>
            <div className={`${styles.Wcercle} ${styles.Hcercle}`}>
                <CircularProgressbarComponent progressPercent={progressPercent}/>
                </div>
                <p className={`${styles.SousText} text-center font-semibold`}>Avancement de la mission</p>
            </div>
            {/* Barre temporelle */}
            <BarProgressComponent data={data} size={size}  progressPercent={progressPercent}/>
            <div className='mt-2 '>
                <Control 
              data={controlData} 
             // data={data}
              statusControl={data} 
                stopPropagation={true} size={size}/>
            </div>


        </div>
    );
}

export default MissionCards;
