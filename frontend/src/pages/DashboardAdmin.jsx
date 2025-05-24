import React, { useEffect, useRef, useState } from 'react'
import SideBar from '../components/sideBar/SideBar'
import SideBarStdr from '../components/sideBar/SideBarStdr'
import HeaderBis from '../components/Header/HeaderBis'
import { useAuth } from '../Context/AuthContext';
import MissionCards from '../components/TBmission/MissionCards';
import HeaderWithAction from '../components/Header/HeaderWithAction';
import { api } from '../Api';
import { useDashboard } from '../Hooks/useDashboard';
import Spinner from '../components/Spinner';

//const TOTAL_CARDS = 10; // Exemple de 10 missions
//const ITEMS_PER_PAGE = 3;

function DashboardAdmin() {

    const { user, viewMode } = useAuth();
    const [currentPage, setCurrentPage] = useState(0);
    const intervalRef = useRef(null);
    const { missionData, loading } = useDashboard();


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

    const totalPages = Math.ceil(missionData?.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const currentMissions = missionData?.slice(startIndex, startIndex + itemsPerPage);

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

                <div className="relative flex flex-row justify-center">

                    {/* Flèche gauche */}
                    <div
                        className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center z-20 text-2xl font-bold rounded-full bg-white shadow-md transition cursor-pointer 
              ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        onClick={handlePrev}
                    >
                        ◀
                    </div>

                    {/* Cartes */}
                    <div className="mt-12 flex flex-wrap mb-8 justify-center gap-6 px-2 sm:px-4 md:px-4 lg:px-6 transition-all duration-500">
                        {(!missionData || loading) ? (
                            <div><Spinner /></div>
                        ) : (
                            currentMissions?.map((mission, index) => (
                                <MissionCards data={mission} key={mission.id || index} size={cardsSize} />
                            ))
                        )}
                    </div>

                    {/* Flèche droite */}
                    <div
                        className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center z-20 text-2xl font-bold rounded-full bg-white shadow-md transition cursor-pointer 
              ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        onClick={handleNext}
                    >
                        ▶
                    </div>

                </div>

            </div>
        </div>
    )
}

export default DashboardAdmin
