import React from 'react'
import "./componentStyle.css"

function Button({btnName,disabled, loading}) {
  return (
    <button 
    className=" className={` 
    border-none  px-4 py-2 bg-[--blue-menu] text-white rounded hover:bg-blue-600 transition 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}" 
        disabled={disabled} >
         {loading ? (
        <div className="flex items-center gap-2">
          <div className="loader spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-white border-t-transparent" />
          <span>Chargement...</span>
        </div>
      ) : (
        btnName
      )}
      </button>
  )
}

export default Button