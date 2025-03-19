import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress"; // Import du spinner

const DecisionPopUp = ({ name, text, loading, handleConfirm, handleDeny }) => {
  return (
    <div
      className="rounded-lg w-auto h-auto bg-white drop-shadow-lg text-black
        flex flex-col justify-around gap-4 p-6"
    >
      <div
        onClick={!loading ? handleDeny : null} // Désactiver la fermeture pendant le chargement
        className="absolute top-0 right-0 text-3xl text-blue mr-2 cursor-pointer"
      >
        &times;
      </div>
      <h2 className="sm:w-auto sm:h-auto text-blue-menu sm:text-xl sm:font-semibold text-xs mt-3">
        {text}
      </h2>
      <span className="text-[var(--subfont-gray)] text-center">{name}</span>

      <div className="sm:flex text-center sm:gap-4 sm:mt-5 mt-1 flex flex-col gap-1 w-auto sm:flex-row sm:justify-center sm:items-center">
        <button
          onClick={handleDeny}
          disabled={loading} // Désactiver pendant le chargement
          className="bg-transparent text-center border border-1 border-blue-menu w-auto h-auto sm:px-6 py-2 px-8 rounded-md text-blue-menu text-xs disabled:opacity-50"
        >
          Non, Annuler
        </button>

        <button
          onClick={handleConfirm}
          disabled={loading} // Désactiver pendant le chargement
          className="bg-blue-conf w-auto h-auto py-2 px-8 text-center rounded-md text-white text-xs flex items-center justify-center disabled:opacity-50"
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Confirmer"}
        </button>
      </div>
    </div>
  );
};

export default DecisionPopUp;
