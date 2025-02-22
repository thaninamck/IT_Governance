import React from 'react'
import "./componentStyle.css"

function Button({btnName,disabled}) {
  return (
    <button className="save-button" disabled={disabled} >
        {btnName}
      </button>
  )
}

export default Button