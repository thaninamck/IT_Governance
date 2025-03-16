import React from "react";
import Spinner from "./Spinner";
import { CircularProgress } from "@mui/material";

const SpinButton = ({ children, isLoading }) => {
    return (
      <button
        type="submit" 
        className="flex items-center justify-center mx-auto mt-10 px-5 py-1.5 text-white bg-blue-menu border-none rounded cursor-pointer text-base disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? <Spinner color="white" /> : children}
      </button>
    );
  };
  
  export default SpinButton;
  