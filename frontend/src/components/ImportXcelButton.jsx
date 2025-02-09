import React from 'react';
import { Button } from "@mui/material";
import * as XLSX from 'xlsx';

const ImportExcelButton = () => {
  // Fonction pour traiter le fichier sélectionné
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Récupère le fichier sélectionné
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Sélectionne la première feuille
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertit la feuille en JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log("Données Excel :", jsonData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  // Fonction pour ouvrir la boîte de dialogue de sélection de fichier
  const handleClick = () => {
    document.getElementById("file-input").click();
  };

  return (
    <Button variant="outlined" onClick={handleClick}>
      Importer Excel
      {/* Input caché pour sélectionner un fichier */}
      <input 
        type="file" 
        id="file-input" 
        hidden 
        accept=".xlsx, .xls" // Accepte les fichiers Excel
        onChange={handleFileChange} 
      />
    </Button>
  );
}

export default ImportExcelButton;
