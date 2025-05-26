import React, { useState, useEffect } from "react";
import { Progress } from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";

const FileUploader = ({onSave}) => {
  // Liste des fichiers uploadés
  const [selectedFiles, setSelectedFiles] = useState([]);

  // État pour la progression de chaque fichier
  const [uploadProgress, setUploadProgress] = useState({});

  // Simuler la progression du téléchargement
  useEffect(() => {
    const simulateUpload = (index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 40; // Incrémenter la progression de 40% à chaque étape
  
        // Forcer la progression à 100% si elle dépasse
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval); // Arrêter l'intervalle une fois terminé
        }
  
        // Mettre à jour l'état avec la nouvelle progression
        setUploadProgress((prev) => ({ ...prev, [index]: progress }));
      }, 100); // Mettre à jour toutes les 100ms
    };

    // Démarrer la simulation pour chaque fichier
    selectedFiles.forEach((_, index) => {
      if (!uploadProgress[index]) {
        simulateUpload(index);
      }
    });
  }, [selectedFiles, uploadProgress]);

  const procesSelectedFiles = (files) => {
    // Convertir la liste des fichiers en tableau
    const filesArray = Array.from(files.target.files);

    // Ajouter les fichiers à la liste des fichiers
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
  };

  const [dragging, setDragging] = useState(false);

  const processSelectedFiles = (e) => {
    e.preventDefault();
    const filesArray = Array.from(e.target.files || e.dataTransfer.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleSubmitFiles = () => {
    const formData = new FormData();

    // Ajouter chaque fichier au FormData
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    
    });
    // Afficher le contenu de FormData
  for (const [key, value] of formData.entries()) {
   // console.log(key, value);
  }
    onSave(formData);
     // Réinitialiser la liste des fichiers et la progression après la sauvegarde
     setSelectedFiles([]);
     setUploadProgress({});
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processSelectedFiles(e);
  };

  const handleClick = () => {
    document.getElementById("file-input").click();
  };

  // Supprimer un fichier de la liste
  const handleDeleteFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-6 ">
      {/* Zone de drop */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col justify-center items-center h-1/2 w-[95%] ${
          dragging ? "border-blue-500" : "border-blue-menu"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick} // Gestion du clic
      >
        <p>
          Cliquez pour parcourir ou <br />
          glissez-déposez vos fichiers.
        </p>
        <input
          type="file"
          id="file-input"
          multiple
          accept=".png, .jpg, .jpeg, .gif, .pdf, .doc, .docx, .xlsx, .txt"
          className="hidden"
          onChange={procesSelectedFiles}
        />
      </div>

      {/* Liste des fichiers uploadés */}
      {selectedFiles.map((file, index) => (
        <div key={index} className="w-[90%]">
       <div
  className="flex flex-col justify-center gap-1 border border-gray-300 rounded-lg p-2 "
    
  
>

        {/* Détails du fichier */}
            <div className="flex justify-between mx-4">
              <p className="font-medium text-xs">{file.name}</p>
              <DeleteIcon
                sx={{ color: "red", cursor: "pointer" ,width:"20px",height:'20px'}}
                onClick={() => handleDeleteFile(index)}
              />
            </div>

            {/* Barre de progression */}
            <Progress
              value={uploadProgress[index] || 0} // Utiliser la progression du fichier
              size="sm"
              label="."
              color="orange"
              className="mx-4 w-auto"
            />

            {/* Taille du fichier */}
            <p className="text-xs text-subfont-gray mx-4">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      ))}

      {/* Bouton Sauvegarder */}
      {(selectedFiles.length > 0 && uploadProgress[0]==100 ) && (
        <button className="bg-[#27AE60] border-0 text-white rounded-lg" onClick={handleSubmitFiles}>
          Sauvegarder
        </button>
      )}
    </div>
  );
};

export default FileUploader;