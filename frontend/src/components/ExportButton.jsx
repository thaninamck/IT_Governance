import React, { useState } from "react";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { Menu, MenuItem, Button } from "@mui/material";
import * as XLSX from "xlsx"; // Import Excel
import jsPDF from "jspdf"; // Import PDF
import "jspdf-autotable"; // Plugin pour gérer les tableaux

function ExportButton({ rowsData, headers, fileName }) {
  const [anchorEl, setAnchorEl] = useState(null);

  // Ouvrir le menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Fermer le menu et appeler l'exportation choisie
  const handleClose = (format) => {
    setAnchorEl(null);
    if (format === "csv") exportToCSV();
    if (format === "excel") exportToExcel();
    if (format === "pdf") exportToPDF();
  };

  // Exporter en CSV
  const exportToCSV = () => {
    if (!rowsData || rowsData.length === 0) return;

    const csvRows = rowsData.map((row) =>
      headers.map((header) => row[header.toLowerCase()]).join(",")
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exporter en Excel
  const exportToExcel = () => {
    if (!rowsData || rowsData.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(rowsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // Exporter en PDF
  const exportToPDF = () => {
    if (!rowsData || rowsData.length === 0) return;

    const doc = new jsPDF();
    doc.text(fileName, 10, 10);
    
    // Transformer les données en tableau
    const tableData = rowsData.map((row) => headers.map((header) => row[header.toLowerCase()]));
    
    doc.autoTable({
      head: [headers], // En-têtes
      body: tableData, // Contenu
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        className="border-none px-3 py-1 bg-[var(--blue-icons)] text-white rounded flex items-center"
      >
        <FileDownloadRoundedIcon sx={{ width: "20px", height: "20px", marginRight: "5px" }} />
        Exporter
      </Button>

      {/* Menu déroulant pour choisir le format */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleClose("csv")}>Exporter en CSV</MenuItem>
        <MenuItem onClick={() => handleClose("excel")}>Exporter en Excel</MenuItem>
        <MenuItem onClick={() => handleClose("pdf")}>Exporter en PDF</MenuItem>
      </Menu>
    </div>
  );
}

export default ExportButton;
