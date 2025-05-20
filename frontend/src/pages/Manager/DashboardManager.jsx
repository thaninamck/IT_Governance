import React, { useState } from 'react'
import SideBar from '../../components/sideBar/SideBar'
import SideBarStdr from '../../components/sideBar/SideBarStdr'
import HeaderBis from '../../components/Header/HeaderBis'
import HeaderWithAction from '../../components/Header/HeaderWithAction'
import { useAuth } from '../../Context/AuthContext'
import { useLocation } from 'react-router-dom'
import CircularProgressbarComponent from '../../components/TBmission/CircularProgressbarComponent'
import BarProgressComponent from '../../components/TBmission/BarProgressComponent'
import Control from '../../components/TBmission/Control'
import RemediationActionData from '../../components/TBmission/RemediationActionData'
import MissionReport from './MissionReport'

function DashboardManager() {

    const { user, viewMode } = useAuth();
    const location = useLocation();
    const missionData = location.state?.missionData;
    console.log('mm', missionData)

    const total = missionData.controls?.length || 0;
    const done = missionData.controls?.filter(c => c.status === 'done').length || 0;
    const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

    const controlData = [
        { id: "1", nom: "Commencé", pourcentage: `${missionData.controlCommencé.pourcentageTotale}` },
        { id: "2", nom: "nom Commencé", pourcentage: `${missionData.controlNonCommencé}` },
        { id: "3", nom: "effective", pourcentage: `${missionData.controlEffctive}` },
        { id: "4", nom: "inéffective", pourcentage: `${missionData.controlNonEffective.pourcentageTotale}` }
    ]
    const statusControlData = [
        { id: "1", nom: "Appliad", pourcentage: `${missionData.controlEffctive}` },
        { id: "2", nom: "Partially appliad", pourcentage: `${missionData.controlNonEffective.partiallyApp}` },
        { id: "3", nom: "Not appliad", pourcentage: `${missionData.controlNonEffective.notApp}` },
        { id: "4", nom: "Not tested", pourcentage: `${missionData.controlNonEffective.notTested}` },
        { id: "5", nom: "Not applicable", pourcentage: `${missionData.controlNonEffective.notApplicable}` }
    ]
    const RemédiationData = [
        { id: "1", nom: "Action", pourcentage: `${missionData.nbrAction.action}` },
        { id: "2", nom: "Terminé", pourcentage: `${missionData.actionTerminé}` },
        { id: "3", nom: "En cours", pourcentage: `${missionData.actionEnCours}` }
    ]
    const remediationActionData = [
        { id: "1", nom: "CTRL_987", NbrAction: "3", pourcentageTerminé: "20%", pourcentageEncours: "80%" },
        { id: "2", nom: "CTRL_901", NbrAction: "7", pourcentageTerminé: "70%", pourcentageEncours: "30%" },
        { id: "3", nom: "CTRL_320", NbrAction: "1", pourcentageTerminé: "0%", pourcentageEncours: "100%" },
        { id: "4", nom: "CTRL_007", NbrAction: "9", pourcentageTerminé: "13%", pourcentageEncours: "87%" },
        { id: "5", nom: "CTRL_097", NbrAction: "11", pourcentageTerminé: "20%", pourcentageEncours: "80%" },
        { id: "6", nom: "CTRL_653", NbrAction: "20", pourcentageTerminé: "20%", pourcentageEncours: "80%" },
    ]
    const getColor = (nom) => {
        switch (nom.toLowerCase()) {
            case 'commencé': return 'bg-yellow-100';
            case 'nom commencé': return 'bg-gray-300';
            case 'effective': return 'bg-green-100';
            case 'inéffective': return 'bg-red-200';
            case 'action': return 'bg-yellow-200';
            case 'terminé': return 'bg-blue-200';
            case 'en cours': return 'bg-orange-200';
            case 'appliad': return 'border-l-4 border-l-green-600';
            case 'partially appliad': return 'border-l-4 border-l-orange-600';
            case 'not appliad': return 'border-l-4 border-l-red-600';
            case 'not tested': return 'border-l-4 border-l-gray-600';
            case 'not applicable': return 'border-l-4 border-l-blue-600';

            default: return 'bg-white';
        }
    };
    const [activeView, setActiveView] = useState("DB_Standard");
    return (
        <div className="flex">
            {user?.role === "admin" && viewMode === "admin" ? (
                <SideBar user={user} />
            ) : (
                <SideBarStdr user={user} />
            )}

            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <HeaderBis />
                <div className='flex flex-row items-end pr-14 justify-between '>
                    <HeaderWithAction
                        title={`La mission ${missionData.missionName}`}
                        user={user}
                        bg_transparent={'bg-transparent'}
                    />
                    <div className="flex border-b-2 border-gray-300 mb-3 ml-8 ">
                        <button
                            className={`px-2 py-2 ${activeView === "DB_Standard"
                                ? "rounded-l rounded-r-none border-none bg-gray-200 text-gray-700 "
                                : "rounded-none text-[var(--subfont-gray)] border-none "
                                } `}
                            onClick={() => setActiveView("DB_Standard")}
                        >
                            Standar
                        </button>
                        <button
                            className={`px-4 py-2 ${activeView === "DB_DSP"
                                ? " rounded-r rounded-l-none  border-none bg-gray-200 text-gray-700"
                                : "rounded-none text-[var(--subfont-gray)] border-none"
                                } `}
                            onClick={() => setActiveView("DB_DSP")}
                        >
                            DSP
                        </button>
                    </div>
                </div>

{(activeView ==='DB_Standard') && (
<>
                <div className="mt-4 flex flex-col md:flex-row  pb-6 px-10 gap-6">
                    <div className='w-full md:w-[40%] flex flex-col justify-center items-center gap-2'>
                        <div className='w-32 h-32'>
                            <CircularProgressbarComponent progressPercent={progressPercent} />
                        </div>
                        <p className='text-l text-center font-semibold'>Avancement de la mission</p>
                    </div>
                    <div className='w-full md:w-[55%] flex flex-col justify-center items-center gap-2'>
                        <BarProgressComponent data={missionData} size="large" />
                    </div>
                </div>

                {/*Control data*/}
                <div className=' px-16'>
                    <Control data={controlData} grid_cols='grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' />
                </div>
                {/*status Control data*/}
                <div className=' px-16 py-8'>
                    <h3 className="text-xl font-bold mb-4">Status Controles</h3>
                    <Control data={statusControlData} grid_cols='grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2' />
                </div>
                {/*Remeddiation data*/}
                <div className='px-16 py-8'>
                    <h3 className="text-xl font-bold mb-4">Remédiation</h3>
                    <div className='flex flex-wrap gap-6 justify-between'>
                        {RemédiationData.map((item) =>
                            item.nom.toLowerCase() === 'action' ? (
                                <div
                                    key={item.id}
                                    className={`w-[250px] cursor-pointer flex flex-col justify-center items-center py-4  rounded shadow-sm hover:shadow-md transition duration-200 ${getColor(item.nom)}`}
                                >
                                    <div
                                        className={`flex  justify-center items-center gap-4`}
                                    >
                                        <p className='text-lg font-semibold'>{item.nom}</p>
                                        <span className='text-right font-semibold px-1 text-black text-l'>
                                            {item.pourcentage}
                                        </span>
                                    </div>
                                    <span className='text-[12px]'>Répartie sur <strong>{missionData.nbrAction.control}</strong> controles</span>
                                </div>
                            ) : (
                                <div
                                    key={item.id}
                                    className='w-[250px] flex  items-center justify-center gap-3 '
                                >
                                    <div className="w-16 h-16">
                                        <CircularProgressbarComponent progressPercent={parseInt(item.pourcentage)} />
                                    </div>
                                    <p className='text-center font-medium'>{item.nom}</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
                {/* Control Remédiation data*/}
                <div className='px-16 pb-4 mb-8 '>
                    <RemediationActionData data={remediationActionData} getColor={getColor} />
                </div>
                </>
)}
{activeView==="DB_DSP" && (<MissionReport/>)}
            </div>
        </div>
    )
}

export default DashboardManager