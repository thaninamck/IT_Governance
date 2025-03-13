import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Spinner = ({ color = "#152259", size = 40 }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress style={{ color }} size={size} />
    </Box>
  );
};

export default Spinner;
