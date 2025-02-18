import React from "react";

function AvatarGroup  ({ names, maxVisible = 3 }) {
  const visibleNames = names.slice(0, maxVisible);
  const hiddenCount = names.length - maxVisible;

  const getInitials = (name) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  return (
    <div className="flex items-center space-x-2">
      <div className="flex -space-x-4">
        {visibleNames.map((name, index) => (
          <div
            key={index}
            className="relative w-10 h-10 flex items-center justify-center bg-white text-blue-600 font-semibold border border-blue-500 rounded-full shadow-md"
            style={{ zIndex: visibleNames.length - index }}
          >
            {getInitials(name)}
          </div>
        ))}
        {hiddenCount > 0 && (
          <div className="w-10 h-10 flex items-center justify-center bg-white text-blue-600 font-semibold border border-blue-500 rounded-full shadow-md">
            +{hiddenCount} more
          </div>
        )}
      </div>
      <span className="text-blue-600 font-medium">{names[0]}</span>
    </div>
  );
};


export default AvatarGroup ;
