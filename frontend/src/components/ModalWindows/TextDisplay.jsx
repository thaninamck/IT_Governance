import React, { useEffect, useRef, useState } from "react";

const TextDisplay = ({
  label,
  content,
  isEditing,
  onContentChange,
  borderWidth,
  labelWidth,
  flexDirection = "row",
  marginLeft = "0px",onSave,
  
}) => {
  const textareaRef = useRef(null);
  const [tempContent, setTempContent] = useState(content);
  const [showSaveButton, setShowSaveButton] = useState(false);

  // Fonction pour ajuster la hauteur du textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Réinitialiser la hauteur
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Ajuster la hauteur en fonction du contenu
    }
  };

  // Ajuster la hauteur du textarea lorsque le contenu change
  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  const handleSave = () => {
    onSave(tempContent);
    setShowSaveButton(false);
  };

  return (
    <div className="relative flex justify-start" style={{ flexDirection }}>
      {/* Label */}
      <label
        htmlFor={label}
        className="text-font-gray font-medium"
        style={{ width: labelWidth }}
      >
        {label}
      </label>

      {/* Textarea */}
      <div
        style={{
          border: `1px solid #dcdcdc`,
          width: borderWidth,
          margin: "2px ",
          marginLeft: marginLeft,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <textarea
          ref={textareaRef}
          id={label}
          value={content}
          className="w-full p-3 rounded-lg bg-transparent"
          readOnly={!isEditing}
          onChange={(event) => {
            onContentChange(event.target.value );
            setShowSaveButton(true);
            adjustTextareaHeight(); 
            
          }}
          style={{
            fontSize: "16px",
            color: "#555",
            resize: "none",
            outline: "none",
            padding: "5px",
            border: "none",
            overflow: "hidden", // Supprimer la barre de défilement
            minHeight: "100px", // Hauteur minimale pour éviter que ce soit trop petit
          }}
        />
         {isEditing && showSaveButton && (
          <button
            onClick={handleSave}
            className="absolute bottom-2 right-14 bg-[var(--blue-menu)] text-white text-sm font-medium py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition-all border-none"
          >
            Modifier
          </button>
        )}
      </div>
    </div>
  );
};

export default TextDisplay;