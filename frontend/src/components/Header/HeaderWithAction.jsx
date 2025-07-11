import React from 'react'

function HeaderWithAction({ title, buttonLabel, onButtonClick,user, bg_transparent}) {
  return (
    <div className="flex items-center justify-between bg-white pl-10  pr-10 mt-8 mb-4 " >
      <h2 className="text-2xl font-semibold">{title}</h2>
      {user?.role === 'admin' &&
      <button
        className={`bg-[--blue-menu] ${bg_transparent} border-none text-white px-4 py-2 rounded hover:bg-blue-600`}
        onClick={onButtonClick}
      >
        {buttonLabel}
      </button>
}
    </div>
  )
}

export default HeaderWithAction;