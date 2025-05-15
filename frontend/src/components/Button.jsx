import React from 'react';
import "./componentStyle.css";
import Spinner from "../components/Spinner";
import { CircularProgress, Box } from "@mui/material";

function Button({ color = "#FFFFFF", size = 40,loading, btnName, disabled }) {
  return (
    <button className="save-button" disabled={disabled}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <CircularProgress style={{ color }} size={size} />
        </div>
      ) : (
        btnName
      )}
    </button>
  );
}

export default Button;