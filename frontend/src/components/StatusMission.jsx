import React from 'react';
import "./componentStyle.css";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentLateRoundedIcon from '@mui/icons-material/AssignmentLate';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function StatusMission({ status }) {
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
        terminee: {
            label: "Terminée",
            icon: <CheckCircleIcon  />, // Vert
            color: "var(--success-green)",
        },
        en_retard: {
            label: "En retard",
            icon: <ErrorOutlineIcon  />, // Rouge
            color: "var(--alert-red)",
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
                width:"170px",
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
