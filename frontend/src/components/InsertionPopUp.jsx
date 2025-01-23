import React, { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Progress } from "@material-tailwind/react";

const InsertionPopUp = ({ value, finishingURL }) => {
    const [progressValue, setProgressValue] = useState(value);

    useEffect(() => {
        // Simule une progression automatique (si nécessaire)
        if (progressValue < 100) {
            const interval = setInterval(() => {
                setProgressValue((prev) => Math.min(prev + 5, 100)); 
            }, 500);
            return () => clearInterval(interval);
        }
    }, [progressValue]);

    return (
        <div className="rounded-xl w-1/4 h-1/4 max-lg:h-auto bg-white drop-shadow-lg text-black
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-around items-center gap-4 p-6">
                
            {/* Barre de progression */}
            <Progress
                value={progressValue}
                size="lg"
                
                label="."
                color="blue"
                className="border border-[#E3E3E3] bg-[#F4F4F4] py-px"
            />

            {/* Affiche l'animation uniquement si la progression est < 100 */}
            {progressValue < 100 && (
                <TypeAnimation
                    preRenderFirstString={true}
                    sequence={[
                        'Insertion en cours',
                        'Insertion en cours.',
                        1000,
                        'Insertion en cours....',
                        1000,
                    ]}
                    style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--bleu-menu)' }}
                    repeat={Infinity}
                    cursor={false}
                />
            )}

            {/* Message de fin si la progression atteint 100 */}
            {progressValue === 100 && (
               <a 
               href={finishingURL} 
               className="bg-subfont-gray w-full sm:w-auto py-2 px-8 rounded-md text-white text-xs flex items-center justify-center 
               sm:py-1 sm:px-4 max-lg:px-6 max-lg:py-2">
               Terminer
           </a>
           
            )}
        </div>
    );
};

export default InsertionPopUp;
