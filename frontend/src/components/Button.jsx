import React from 'react'
import "./componentStyle.css"

function Button({btnName}) {
  return (
    <button className="save-button" onClick={() => alert('Données enregistrées')}>
        {btnName}
      </button>
  )
}

export default Button