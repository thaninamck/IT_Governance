import { useState } from "react";
import { MessageSquarePlus } from "lucide-react"; // ou ton icône si besoin

export default function   CommentButton  ({ onSave, onCancel })  {
  const [text, setText] = useState("");

  return (
    <div className="w-48 bg-white p-2 rounded shadow-md border border-gray-300">
      <textarea
        className="w-full p-1 mb-2 text-sm border rounded"
        onChange={(e) => setText(e.target.value)}
        autoFocus
        placeholder="Écrire un commentaire..."
      />
      <div className="flex justify-end space-x-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Annuler
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(text);
          }}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};