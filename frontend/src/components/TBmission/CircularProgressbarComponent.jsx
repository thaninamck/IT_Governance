import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

function CircularProgressbarComponent({ progressPercent, pathColor = '#3b82f6' }) {
  return (
    <CircularProgressbar
      value={progressPercent}
      text={`${progressPercent}%`}
      styles={buildStyles({
        textColor: '#1f2937',
        pathColor: pathColor,
        trailColor: '#e5e7eb',
      })}
    />
  );
}

export default CircularProgressbarComponent;
