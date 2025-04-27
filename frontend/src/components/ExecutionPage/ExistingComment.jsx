import { useState } from "react";
import { MessageSquare } from "lucide-react"; // Icône bulle vide

export default function ExistingComment({ user, comment }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-gray-800 border-none hover:text-black"
      >
        <MessageSquare size={25} />
      </button>

      {showDetails && (
        <div className="absolute right-0 top-6 bg-white border p-3 rounded shadow w-72">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-nav rounded-full w-8 h-8 flex text-blue-conf items-center justify-center text-sm font-bold">
              {user.initials}
            </div>
            <span className="font-medium">{user.name}</span>
          </div>
          <p className="text-sm text-gray-700">{comment}</p>
        </div>
      )}
    </div>
  );
}
