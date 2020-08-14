import React, { useEffect, useState } from 'react';
import '../styles/BigButton.css'

const BigButton = props => {
  
  return (
    <div className="bigButton">
      <h1>{props.text}</h1>
      <img src={props.icon}/>
    </div>
  )
}

export default BigButton;