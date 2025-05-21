import React, { useEffect, useRef, useState } from 'react'
import SideBar from '../components/sideBar/SideBar'
import SideBarStdr from '../components/sideBar/SideBarStdr'
import HeaderBis from '../components/Header/HeaderBis'
import { useAuth } from '../Context/AuthContext';
import MissionCards from '../components/TBmission/MissionCards';
import HeaderWithAction from '../components/Header/HeaderWithAction';
import { api } from '../Api';


//const TOTAL_CARDS = 10; // Exemple de 10 missions
//const ITEMS_PER_PAGE = 3;

function DashboardAdmin() {


    const { user, viewMode } = useAuth();
    const [currentPage, setCurrentPage] = useState(0);
    const intervalRef = useRef(null);

    const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());
    const [cardsSize, setCardsSize] = useState(getcardsSize());
    function getItemsPerPage() {
        const width = window.innerWidth;
        if (width >= 1300) return 5; // grands écrans
        if (width >= 992) return 3; // tablettes / laptop
        if (width >= 768) return 2; // petits laptops / tablettes
        return 1; // mobiles
    }

    function getcardsSize() {
        const width = window.innerWidth;
        if (width >= 1300) return 'large'; // grands écrans
        if (width >= 992) return 'medium'; // tablettes / laptop
        if (width >= 768) return 'small'; // petits laptops / tablettes
        return 'medium'; // mobiles
    }

    console.log('cardssize',cardsSize)

    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(getItemsPerPage());
            setCurrentPage(0); // réinitialiser à la première page
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    useEffect(() => {
        const handleResize = () => {
            setCardsSize(getcardsSize());
            
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // On génère 10 fausses cartes avec un index
    // const missions = Array.from({ length: TOTAL_CARDS }, (_, i) => i);

    const [missionData, setMissionData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMissionsDashboard = async () => {
        try {
            const response = await api.get('/dashboard'); 
            console.log('db admin mission',response.data)
            setMissionData(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des missions :", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMissionsDashboard();
    }, []);
    // const missionData = [
    //     {
    //         id: "1",
    //         missionName: "DSP",
    //         client: 'Djezzy',
    //         nbrControl: '26',
    //         startDate: '2025-05-01',
    //         endDate: '2025-06-30',
    //         controls: Array(26).fill().map((_, i) => ({ id: i, status: i < 20 ? 'done' : 'pending' })),
    //         controlCommencé: { pourcentageTotale: "20", pourcentageFinalisé: "27", pourcentageNonFinalisé: "73" },
    //         controlNonCommencé: "80",
    //         controlEffctive: "75",
    //         controlNonEffective: { pourcentageTotale: "35", partiallyApp: "25", notApp: "63", notTested: "7", notApplicable: '5' },
    //         nbrAction:{action:"30",control:'5'},
    //         actionTerminé: "13",
    //         actionEnCours: "17"
    //     },
       
    // ]

    
    const totalPages = Math.ceil(missionData.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const currentMissions = missionData.slice(startIndex, startIndex + itemsPerPage);

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

                <div className="relative flex flex-row items-center justify-center ">

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
                   
                    <div className="mt-12 flex flex-wrap mb-8 justify-center gap-6 px-2 sm:px-4 md:px-4 lg:px-6 transition-all duration-500">

                        {currentMissions.map((mission, index) => (
                            <MissionCards data={mission} key={mission.id || index} size={cardsSize}  />
                        ))}
                    </div>

                    <div
                       className={` z-10 cursor-pointer ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
