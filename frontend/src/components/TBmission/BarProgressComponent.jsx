import React from 'react'
import dayjs from 'dayjs';

function BarProgressComponent({ data, size = 'medium',progressPercent = 0 }) {
    const now = dayjs();
    const start = dayjs(data?.startDate);
    const end = dayjs(data.endDate);
    const totalDuration = end.diff(start, 'day');
    const elapsed = now.diff(start, 'day');
    const timePercent = totalDuration > 0 ? Math.min(Math.max(Math.round((elapsed / totalDuration) * 100), 0), 100) : 0;

    const remainingDays = Math.max(end.diff(now, 'day'), 0);
    console.log('remaining day',remainingDays)
    const remainingDuration = dayjs.duration(remainingDays, 'days');
    const formattedRemaining = remainingDays >= 30
        ? `${remainingDuration.months()} mois ${remainingDuration.days()} jours`
        : `${remainingDays} jours`;
    // const getTimeColor = () => {
    //     const remainingPercent = 100 - timePercent;
    //     if (remainingPercent > 50) return 'bg-green-500 text-green-600';
    //     if (remainingPercent > 20) return 'bg-orange-400 text-orange-500';
    //     return 'bg-red-500 text-red-600';
       
    // };

    const getTimeStatus = () => {
        // Exemples :
        // - progressPercent = 40 (travail effectué à 40%)
        // - timePercent = 70 (70% du temps déjà écoulé)
    
        const progressVsTimeDiff = progressPercent - timePercent; // différence entre l'avancement réel et le temps écoulé
        console.log('progressVsTimeDiff',progressVsTimeDiff)
        const isLate = progressVsTimeDiff < -20; // trop en retard
        console.log('isLate',isLate)
        const isCatchingUp = progressVsTimeDiff >= -20 && progressVsTimeDiff < -5; // un peu en retard
        console.log('isCatchingUp',isCatchingUp)
        const isOnTrack = progressVsTimeDiff >= -5; // dans les temps ou en avance
        console.log('isOnTrack',isOnTrack)
    
        if (isLate) return { bg: 'bg-red-500', text: 'text-red-600', alert: true };
        if (isCatchingUp) return { bg: 'bg-orange-400', text: 'text-orange-500', alert: false };
        return { bg: 'bg-green-500', text: 'text-green-600', alert: false };
    };
    
    
    const { bg, text, alert } = getTimeStatus();

   

    // Styles dynamiques selon la taille
    const sizeStyles = {
        small: {
            text: 'text-[10px]',
            SousText:'text-[11px]',
            barHeight: 'h-[4px]',
            barContainerWidth: 'w-[60%]',
            dateText: 'text-[10px]',
        },
        medium: {
            text: 'text-xs',
            SousText:'text-[11px]',
            barHeight: 'h-[5px]',
            barContainerWidth: 'w-[70%]',
            dateText: 'text-xs',
        },
        large: {
            text: 'text-[14px]',
            SousText:'text-[11px]',
            barHeight: 'h-[10px]',
            barContainerWidth: 'w-full',
            dateText: 'text-sm',
        }
    };

    const styles = sizeStyles[size] || sizeStyles.medium;
   // const [bgColor, textColor] = getTimeColor().split(' ');

    return (
        <div className='my-4 w-full flex flex-col '>
            <p className={`font-semibold mb-2 ${styles.text}`}>
                Temps écoulé : {timePercent}%
            </p>
            {alert && (
            <div className="text-red-700 bg-red-100 border border-red-400 rounded p-2 mb-2 text-sm font-medium text-center">
                ⚠️ Tu es en retard ! Avancement insuffisant pour le temps restant.
            </div>
        )}
            <div className='flex items-center gap-2 w-full justify-center'>
                <div className={`${styles.barContainerWidth} bg-gray-200 ${styles.barHeight} rounded overflow-hidden`}>
                    <div
                        className={`${styles.barHeight} ${bg}`}
                        style={{ width: `${timePercent}%` }}
                    />
                </div>
                <span className={`font-medium whitespace-nowrap ${styles.SousText} ${text}`}>
                    ⏳ Il reste {formattedRemaining}
                </span>
            </div>
            <p className={`text-center mt-4 text-gray-500 ${styles.dateText}`}>
                {start.format('DD/MM/YYYY')} → {end.format('DD/MM/YYYY')}
            </p>
        </div>
    );
}


export default BarProgressComponent