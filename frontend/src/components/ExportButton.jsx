import React from 'react';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import * as XLSX from 'xlsx'; // Importation de XLSX

function ExportButton({ rowsData,headers, fileName }) { // Récupérer les données en prop

    // Fonction d'exportation en CSV
    const exportToCSV = () => {
        if (!rowsData || rowsData.length === 0) return;

        /*const csvHeader = ['Client', 'Mission', 'Manager', 'Date de début', 'Date fin', 'Status'];
        const csvRows = rowsData.map(row => 
            [row.client, row.mission, row.manager, row.dateField, row.dateField1, row.statusMission].join(',')
        );*/
        const csvRows = rowsData.map(row => 
            headers.map(header => row[header.toLowerCase()]).join(',')
        );

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Fonction pour exporter en format Excel
    const exportToExcel = () => {
        if (!rowsData || rowsData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(rowsData); // Convertir en feuille Excel
        const workbook = XLSX.utils.book_new(); // Créer un classeur
        XLSX.utils.book_append_sheet(workbook, worksheet, fileName); // Ajouter la feuille

        // Générer et télécharger le fichier Excel
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (
        <button onClick={exportToExcel} className="border-none px-3 py-1 bg-[var(--blue-icons)] text-white rounded flex items-center">
            <FileDownloadRoundedIcon sx={{ width: '20px', height: '20px', marginRight: '5px' }} />
            Exporter
        </button>
    );
}

export default ExportButton;
