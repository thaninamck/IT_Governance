import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Spinner = ({ color = "#152259", size = 40 }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
<div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
      {/* <CircularProgress style={{ color }} size={size} /> */}
    </Box>
  );
};

export default Spinner;
