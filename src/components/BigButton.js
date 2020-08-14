import React from 'react';
import '../styles/BigButton.css'

const BigButton = props => {
  return (
    <div className={`bigButton ${props.className}`} onClick={props.onClick}>
      <h1>{props.text}</h1>
      <div className="icon">
        {props.icon}
      </div>
    </div>
  )
}

export default BigButton;