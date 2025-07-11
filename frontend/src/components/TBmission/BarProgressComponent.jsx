import React from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

function BarProgressComponent({ data, size = 'medium' }) {
    const now = dayjs();
    const start = dayjs(data?.startDate);
    const end = dayjs(data.endDate);
    const totalDuration = end.diff(start, 'day');
    const elapsed = now.diff(start, 'day');

    const cappedElapsed = Math.min(Math.max(elapsed, 0), totalDuration);
    const timePercent = totalDuration > 0
        ? Math.min(Math.max(Math.round((cappedElapsed / totalDuration) * 100), 0), 100)
        : 0;

    const finalizedExecutions = data.controlCommencé?.nbrFinalisé ?? 0;
    const totalExecutions = data.nbrControl ?? 0;

    const expectedExecutions = totalExecutions * (cappedElapsed / totalDuration);
    const diffExecutions = finalizedExecutions - expectedExecutions;

    const isOverdue = now.isAfter(end) && finalizedExecutions < totalExecutions;
    const isLate = isOverdue || diffExecutions < -5;
    const isCatchingUp = diffExecutions >= -5 && diffExecutions < 0;
    const isOnTrack = diffExecutions >= 0;

    const getTimeStatus = () => {
        if (isLate) return { bg: 'bg-red-500', text: 'text-red-600', alert: true };
        if (isCatchingUp) return { bg: 'bg-orange-400', text: 'text-orange-500', alert: false };
        return { bg: 'bg-green-500', text: 'text-green-600', alert: false };
    };

    const { bg, text, alert } = getTimeStatus();

    // Jours restants
    const remainingDays = Math.max(end.diff(now, 'day'), 0);
    const remainingDuration = dayjs.duration(remainingDays, 'days');
    const formattedRemaining = remainingDays >= 30
        ? `${remainingDuration.months()} mois ${remainingDuration.days()} jours`
        : `${remainingDays} jours`;

    const sizeStyles = {
        small: {
            text: 'text-[10px]',
            SousText: 'text-[11px]',
            barHeight: 'h-[4px]',
            barContainerWidth: 'w-[60%]',
            dateText: 'text-[10px]',
        },
        medium: {
            text: 'text-xs',
            SousText: 'text-[11px]',
            barHeight: 'h-[5px]',
            barContainerWidth: 'w-[70%]',
            dateText: 'text-xs',
        },
        large: {
            text: 'text-[14px]',
            SousText: 'text-[11px]',
            barHeight: 'h-[10px]',
            barContainerWidth: 'w-full',
            dateText: 'text-sm',
        }
    };

    const styles = sizeStyles[size] || sizeStyles.medium;

    return (
        <div className='my-4 w-full flex flex-col'>
            <p className={`font-semibold mb-2 ${styles.text}`}>
                Temps écoulé : {timePercent}%
            </p>
            {alert && (
                <div className="text-red-700 bg-red-100 border border-red-400 rounded p-2 mb-2 text-sm font-medium text-center">
                    ⚠️ Tu es en retard ! Avancement insuffisant pour le temps écoulé.
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

export default BarProgressComponent;
