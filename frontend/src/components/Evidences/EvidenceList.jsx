import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import UploadIcon from "@mui/icons-material/CloudDownload";

const EvidenceList = ({ files, onDelete, getFile , readOnly=false ,deletingId}) => {
  /* Fonction de suppression déjà définie dans la page parente commme ca 
  const [files, setFiles] = useState([
  { name: 'file1.txt', size: 2048 },
  { name: 'file2.jpg', size: 4096 },
  // autres fichiers
]);

const handleDelete = (index) => {
  const updatedFiles = files.filter((_, i) => i !== index); // Filtrer le fichier à supprimer
  setFiles(updatedFiles); // Mettre à jour l'état des fichiers
};
  
  */

  return (
    <>
      {files.map((file, index) => (
        <div
          key={index}
          className={`flex relative w-[95%] flex-col mt-2 justify-center border border-gray-300 rounded-lg p-2 ${
            file.evidence_id !== undefined && file.evidence_id === deletingId
            ? "bg-gray-200 opacity-60 pointer-events-none"
            : "bg-white"
                    }`}        >
          {/* Détails du fichier */}
          <div className="flex justify-between mx-4 ">
            <a
              href={`${getFile}${file.stored_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              <p className="font-medium text-sm">{file.file_name}</p>
            </a>{" "}
            {/* Utilisation du nom du fichier */}
            {/* ici on va traiter la suppression durant la programmmation */}
            {!readOnly ? (
              <DeleteIcon
                sx={{ color: "red", cursor: "pointer" }}
                onClick={() => onDelete(index)} // Appel de la fonction onDelete avec l'index
              />
            ) : (
              <a
                href={`${getFile}${file.stored_name}`}
                target="_blank"
              rel="noopener noreferrer"
                download
                className="text-green-500 cursor-pointer"
              >
                <UploadIcon sx={{ fontSize: 20, cursor: "pointer" }} />
              </a>
            )}
          </div>

          {/* Taille du fichier */}
          {/* <p className="text-xs text-subfont-gray mx-4">
            {(file.size / 1024 / 1024).toFixed(2)} MB {/* Calcul de la taille en Mo 
          </p> */}
        </div>
      ))}
    </>
  );
};

export default EvidenceList;
