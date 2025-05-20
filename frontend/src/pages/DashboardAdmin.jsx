import React, { useRef, useState } from 'react'
import SideBar from '../components/sideBar/SideBar'
import SideBarStdr from '../components/sideBar/SideBarStdr'
import HeaderBis from '../components/Header/HeaderBis'
import { useAuth } from '../Context/AuthContext';
import MissionCards from '../components/TBmission/MissionCards';
import HeaderWithAction from '../components/Header/HeaderWithAction';


//const TOTAL_CARDS = 10; // Exemple de 10 missions
const ITEMS_PER_PAGE = 4;

function DashboardAdmin() {


    const { user, viewMode } = useAuth();
    const [currentPage, setCurrentPage] = useState(0);
    const intervalRef = useRef(null);


    // On génère 10 fausses cartes avec un index
    // const missions = Array.from({ length: TOTAL_CARDS }, (_, i) => i);



    const missionData = [
        {
            id: "1",
            missionName: "DSP",
            client: 'Djezzy',
            nbrControl: '26',
            startDate: '2025-05-01',
            endDate: '2025-06-30',
            controls: Array(26).fill().map((_, i) => ({ id: i, status: i < 20 ? 'done' : 'pending' })),
            controlCommencé: { pourcentageTotale: "20", pourcentageFinalisé: "27", pourcentageNonFinalisé: "73" },
            controlNonCommencé: "80",
            controlEffctive: "75",
            controlNonEffective: { pourcentageTotale: "35", partiallyApp: "25", notApp: "63", notTested: "7", notApplicable: '5' },
            nbrAction:{action:"30",control:'5'},
            actionTerminé: "13",
            actionEnCours: "17"
        },
        {
            id: "2",
            missionName: "ITGC",
            client: 'ATM',
            nbrControl: '2',
            startDate: '2025-05-01',
            endDate: '2025-06-01',
            controls: [{ id: 1, status: 'done' }, { id: 2, status: 'pending' }],
            controlCommencé: { pourcentageTotale: "50", pourcentageFinalisé: "50", pourcentageNonFinalisé: "0" },
            controlNonCommencé: "50",
            controlEffctive: "60",
            controlNonEffective: { pourcentageTotale: "40", partiallyApp: "10", notApp: "20", notTested: "5", notApplicable: '5' },
            nbrAction: {action:"5",control:'2'},
            actionTerminé: "2",
            actionEnCours: "3"
        },
        {
            id: "3",
            missionName: "ISO 27001",
            client: 'Mobilis',
            nbrControl: '36',
            startDate: '2025-03-01',
            endDate: '2025-06-02',
            controls: Array(36).fill().map((_, i) => ({ id: i, status: i < 10 ? 'done' : 'pending' })),
            controlCommencé: { pourcentageTotale: "28", pourcentageFinalisé: "20", pourcentageNonFinalisé: "80" },
            controlNonCommencé: "72",
            controlEffctive: "50",
            controlNonEffective: { pourcentageTotale: "50", partiallyApp: "15", notApp: "25", notTested: "5", notApplicable: '5' },
            nbrAction: {action:"18",control:'10'},
            actionTerminé: "7",
            actionEnCours: "11"
        },
        {
            id: "4",
            missionName: "Self Testing",
            client: 'Mazars',
            nbrControl: '36',
            startDate: '2025-05-10',
            endDate: '2025-06-02',
            controls: Array(36).fill().map((_, i) => ({ id: i, status: i < 20 ? 'done' : 'pending' })),
            controlCommencé: { pourcentageTotale: "60", pourcentageFinalisé: "55", pourcentageNonFinalisé: "45" },
            controlNonCommencé: "40",
            controlEffctive: "80",
            controlNonEffective: { pourcentageTotale: "20", partiallyApp: "10", notApp: "5", notTested: "3", notApplicable: '2' },
            nbrAction: {action:"25",control:'8'},
            actionTerminé: "15",
            actionEnCours: "10"
        },
        {
            id: "5",
            missionName: "RNCI",
            client: 'KPMG',
            nbrControl: '36',
            startDate: '2025-05-01',
            endDate: '2025-06-12',
            controls: Array(36).fill().map((_, i) => ({ id: i, status: i < 5 ? 'done' : 'pending' })),
            controlCommencé: { pourcentageTotale: "14", pourcentageFinalisé: "13.8", pourcentageNonFinalisé: "86.2" },
            controlNonCommencé: "86",
            controlEffctive: "40",
            controlNonEffective: { pourcentageTotale: "60", partiallyApp: "10", notApp: "40", notTested: "5", notApplicable: '5' },
            nbrAction: {action:"18",control:'1'},
            actionTerminé: "3",
            actionEnCours: "9"
        },


    ]

    
    const totalPages = Math.ceil(missionData.length / ITEMS_PER_PAGE);
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const currentMissions = missionData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const startAutoScroll = (direction) => {
        if (intervalRef.current) return; // ne pas dupliquer les intervals

        intervalRef.current = setInterval(() => {
            setCurrentPage((prev) => {
                if (direction === 'left' && prev > 0) return prev - 1;
                if (direction === 'right' && prev < totalPages - 1) return prev + 1;
                return prev;
            });
        }, 500); // toutes les 500ms
    };

    const stopAutoScroll = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    return (
        <div className="flex">
            {user?.role === "admin" && viewMode === "admin" ? (
                <SideBar user={user} />
            ) : (
                <SideBarStdr user={user} />
            )}

            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <HeaderBis />
                <HeaderWithAction
                    title="Missions en cours"
                    user={user}
                    bg_transparent={'bg-transparent'}
                />

                <div className="relative flex flex-row items-center justify-center gap-4  pl-1">

                    {/* Zones de scroll gauche/droite */}
                    <div
                       className={`w-8 z-10 cursor-pointer ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        // onMouseEnter={() => startAutoScroll('left')}
                        // onMouseLeave={stopAutoScroll}
                        onClick={handlePrev}
                        disabled={currentPage === 0}
                >
                    ◀
                    </div>
                   
                    <div className="flex flex-wrap mb-8 justify-center gap-6 px-2 sm:px-4 md:px-4 lg:px-6 transition-all duration-500">

                        {currentMissions.map((mission, index) => (
                            <MissionCards data={mission} key={mission.id || index}  />
                        ))}
                    </div>

                    <div
                       className={`w-8 z-10 cursor-pointer ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleNext}
                        disabled={currentPage === totalPages - 1}
                        // onMouseEnter={() => startAutoScroll('right')}
                        // onMouseLeave={stopAutoScroll}
                    >
                       ▶ 
                    </div>
                

                </div>
            </div>
        </div>
    )
}

export default DashboardAdmin
