import React, { useState } from "react";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { Menu, MenuItem, Button } from "@mui/material";
import * as XLSX from "xlsx"; // Import Excel
import jsPDF from "jspdf"; // Import PDF
import "jspdf-autotable"; // Plugin pour gérer les tableaux

function ExportButton({ rowsData,/* headers*/columns, fileName }) {
  const [anchorEl, setAnchorEl] = useState(null);

  // Ouvrir le menu
  const handleClick = (event) => {setAnchorEl(event.currentTarget); };

  // Fermer le menu et appeler l'exportation choisie
  const handleClose = (format) => {
    setAnchorEl(null);
    if (format === "csv") exportToCSV();
    if (format === "excel") exportToExcel();
    if (format === "pdf") exportToPDF();
  };
  const getExportableColumns = () => {
    return columns
      .filter((col) => col.field !== "actions" && col.field !== "request")
      .flatMap((col) => {
        if (col.field === "auditPeriod") {
          return [
            { field: "auditStartDate", headerName: "Début période auditée" },
            { field: "auditEndDate", headerName: "Fin période auditée" },
          ];
        }
        return col;
      });
  };
  // Exporter en CSV
  const exportToCSV = () => {
    if (!rowsData || rowsData.length === 0) return;

   
    const exportableCols = getExportableColumns();
    const headers = exportableCols.map((col) => col.headerName);
    const fields = exportableCols.map((col) => col.field);

   
    const csvRows = rowsData.map((row) =>
      fields.map((field) => {
        if (field === "auditStartDate" || field === "auditEndDate") {
          return `"${new Date(row[field]).toLocaleDateString("fr-FR")}"`;
        }
        return `"${row[field] ?? ''}"`;
      }).join(",")
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

    const exportableCols = getExportableColumns();
    const fields = exportableCols.map((col) => col.field);
    const headers = exportableCols.map((col) => col.headerName);

    const formattedData = rowsData.map((row) => {
      const newRow = {};
      fields.forEach((field, i) => {
        if (field === "auditStartDate" || field === "auditEndDate") {
          newRow[headers[i]] = new Date(row[field]).toLocaleDateString("fr-FR");
        } else {
          newRow[headers[i]] = row[field];
        }
      });
      return newRow;
    });



    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // Exporter en PDF
  const exportToPDF = () => {
    if (!rowsData || rowsData.length === 0) return;

    const doc = new jsPDF();
    doc.text(fileName, 10, 10);
    
    const exportableCols = getExportableColumns();
    const headers = exportableCols.map((col) => col.headerName);
    const fields = exportableCols.map((col) => col.field);

    const tableData = rowsData.map((row) =>
      fields.map((field) => {
        if (field === "auditStartDate" || field === "auditEndDate") {
          return new Date(row[field]).toLocaleDateString("fr-FR");
        }
        return row[field] ?? "";
      })
    );
    
    doc.autoTable({
      head: [headers], // En-têtes
      body: tableData, // Contenu
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <div>
      <Button
      variant="outlined"
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