// import { useState } from "react";
// import { MessageSquarePlus } from "lucide-react"; // ou ton icône si besoin

// export default function   CommentButton  ({ onSave, onCancel })  {
//   const [text, setText] = useState("");

//   return (
//     <div className="w-48 bg-white p-2 rounded shadow-md border border-gray-300">
//       <textarea
//         className="w-full p-1 mb-2 text-sm border rounded"
//         onChange={(e) => setText(e.target.value)}
//         autoFocus
//         placeholder="Écrire un commentaire..."
//       />
//       <div className="flex justify-end space-x-2">
//         <button 
//           onClick={(e) => {
//             e.stopPropagation();
//             onCancel();
//           }}
//           className="text-xs text-gray-500 hover:text-gray-700"
//         >
//           Annuler
//         </button>
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onSave(text);
//           }}
//           className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
//         >
//           Enregistrer
//         </button>
//       </div>
//     </div>
//   );
// };

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react"; // icône si besoin

export default function CommentButton({ onSave, onCancel }) {
  const [text, setText] = useState("");

  return (
    <div className="w-64 bg-white p-3 rounded-2xl shadow-lg border border-gray-200">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        placeholder="Écrire un commentaire..."
        rows={3}
        className="w-full resize-none p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
      />

      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="text-xs px-3 py-1 border-none rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition"
        >
          Annuler
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(text);
          }}
          disabled={!text.trim()}
          className="text-xs px-4 py-1.5 border-none rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-0 transition"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
