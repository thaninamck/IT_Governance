import { useState, useEffect } from "react";
import { MessageSquare, Trash2, Pencil } from "lucide-react"; // Icônes

export default function ExistingComment({ user, comment, onDelete, onEdit }) {
  const [showDetails, setShowDetails] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("User"));
    setCurrentUserId(localUser?.id);
  }, []);

  const isOwner = currentUserId === user.id;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-gray-800 border-none hover:text-black"
      >
        <MessageSquare size={25} />
      </button>

      {showDetails && (
        <div className="absolute right-0 top-6 bg-white border p-3 rounded shadow w-72 z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-blue-nav rounded-full w-8 h-8 flex text-blue-conf items-center justify-center text-sm font-bold">
                {user.initials}
              </div>
              <span className="font-medium">{user.name}</span>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <button onClick={onEdit}>
                  <Pencil size={16} className="text-gray-500 hover:text-blue-600" />
                </button>
                <button onClick={onDelete}>
                  <Trash2 size={16} className="text-gray-500 hover:text-red-600" />
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-700">{comment}</p>
        </div>
      )}
    </div>
  );
}
