import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

function CircularProgressbarComponent({progressPercent}) {
  return (
    
    <CircularProgressbar
        value={progressPercent}
        text={`${progressPercent}%`}
        styles={buildStyles({
            textColor: '#1f2937',
            pathColor: '#3b82f6',
            trailColor: '#e5e7eb',
        
        }) }
    />

  )
}

export default CircularProgressbarComponent