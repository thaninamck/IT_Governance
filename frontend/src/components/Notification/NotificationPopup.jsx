import React, { useState, useEffect } from "react";
import "./NotificationBar.css";
import icons from '../../assets/Icons'; // Importing icons from the icons.js file
import NotificationBar from "./NotificationBar";
const NotificationPopup = ({  }) => {
  

  return (
    <div className="absolute top-7 right-0 bg-white text-black border border-gray-300 rounded-md w-[600px] p-2 shadow-md z-[1000]
 max-h-96 overflow-y-auto">
      <NotificationBar/>
    </div>
  );
};

export default NotificationPopup;
