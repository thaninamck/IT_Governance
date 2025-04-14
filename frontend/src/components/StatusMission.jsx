import React from 'react';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentLateRoundedIcon from '@mui/icons-material/AssignmentLate';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';

function StatusMission({ status }) {
   // console.log("Statut reçu:", status);
    // Configuration des statuts
    const statusConfig = {
        non_commencee: {
            label: "Non commencée",
            icon: <AccessTimeFilledIcon   />, // Orange
            color: "var(--status-gray)",
        },
        en_cours: {
            label: "En cours",
            icon: <AccessTimeFilledIcon  />, // Bleu
            color: "var(--await-orange)",
        },
        en_retard: {
            label: "En cours retardé",
            icon: <ErrorOutlineIcon  />, // Rouge
            color: "var(--alert-red)",
        },
        
        clôturée: {
            label: "clôturée",
            icon: <CheckCircleIcon  />, // Vert
            color: "var(--success-green)",
        },
        archivée: {
            label: "Archivée",
            icon: <ArchiveRoundedIcon />, // Rouge
            color: "#6b7280",
        },
        annulée: {
            label: "Annulée",
            icon: <CancelIcon  />, // Rouge
            color: "#E53935",
        },
        en_attente: {
            label: "En standby ",
            icon: <PauseCircleIcon   />, // Rouge
            color: "#cccccc",
        },
        en_attente_archivage: {
            label: "en attente d'archivage ",
            icon: <AccessTimeFilledIcon  />, 
            color: "#cccccc",
        },
        en_attente_annulation: {
            label: "en attente d'annulation ",
            icon: <AccessTimeFilledIcon  />, 
            color: "#cccccc",
        },
        en_attente_de_clôture: {
            label: "en attente de clôture ",
            icon: <AccessTimeFilledIcon  />, 
            color: "#cccccc",
        },
    };

  

    const currentStatus = statusConfig[status];
    


    if (!currentStatus) {
        
        return <div>Statut inconnu</div>; // Gérer les cas de statut invalide
    }

    return (
        <div 
            className="status_container" 
            style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: currentStatus.color, // Couleur en transparence
                borderRadius: "40px",
                padding: "8px 12px",
                gap: "8px",
                color: 'white',
                fontWeight: "bold",
                fontSize:'12px',
                width:"195px",
                height:'35px',
               /* marginTop:"7px"*/
            }}
        >
            {currentStatus.icon}
            <p style={{ margin: 0 }}>{currentStatus.label}</p>
        </div>
    );
}

export default StatusMission;
