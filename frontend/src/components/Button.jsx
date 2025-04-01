import React from 'react';
import "./componentStyle.css";
import Spinner from "../components/Spinner";

function Button({ loading, btnName, disabled }) {
  return (
    <button className="save-button" disabled={disabled}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Spinner color="var(--blue-menu)" />
        </div>
      ) : (
        btnName
      )}
    </button>
  );
}

export default Button;