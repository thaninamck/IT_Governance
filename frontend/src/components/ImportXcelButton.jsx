import React, { useState,useEffect } from "react";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import { use } from "react";

const ImportExcelButton = ({
  onDataImported,
  onConfirmInsertion,
  formatData,
}) => {
  const [importedData, setImportedData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log("Excel data:", jsonData); // Vérifie si le fichier est bien lu

        if (formatData) {
          const formattedData = formatData(jsonData);
          setImportedData(formattedData);

          console.log("Formatted data:", formattedData); // Vérifie si les données sont bien formatées
          onDataImported && onDataImported(formattedData);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };
  useEffect(() => {
    console.log("importedData:", importedData, "Type:", typeof importedData, "IsArray:", Array.isArray(importedData));
  }, [importedData]);
  
  const handleCancel = () => {
    setImportedData([]);
    document.getElementById("file-input").value = "";
  };

  return (
    <div className="flex gap-2 items-start">
      <div className="flex flex-col">
        <Button
          variant="outlined"
          onClick={() => document.getElementById("file-input").click()}
        >
          Importer Excel
        </Button>
        <input
          type="file"
          id="file-input"
          hidden
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />
        {importedData.length > 0 && (
          <p className="text-xs">{importedData.length} éléments importés</p>
        )}
      </div>

      {importedData.length > 0 && (
        <div className="flex gap-2 items-start">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onConfirmInsertion(importedData);
              setImportedData([]);
            }}
          >
            Confirmer l'insertion
          </Button>

          <Button variant="outlined" color="inherit" onClick={handleCancel}>
            Annuler
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImportExcelButton;
