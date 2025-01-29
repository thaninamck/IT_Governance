import React from 'react'

function HeaderWithAction({ title, buttonLabel, onButtonClick }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded shadow" >
      <h2 className="text-lg font-semibold">{title}</h2>
      <button
        className="bg-[--blue-conf]  border-none text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={onButtonClick}
      >
        {buttonLabel}
      </button>
    </div>
  )
}

export default HeaderWithAction;