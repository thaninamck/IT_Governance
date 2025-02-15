import React from 'react'
import "./componentStyle.css"

function Button({btnName}) {
  return (
    <button className="save-button" >
        {btnName}
      </button>
  )
}

export default Button