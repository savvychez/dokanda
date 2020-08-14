import React, { useEffect, useState } from 'react';
import '../styles/BigButton.css'

const BigButton = props => {
  const icon = <>props.children</>

  return (
    <div className="bigButton">
      <h1>{props.text}</h1>
      <div className="icon">
        {props.icon}
      </div>
    </div>
  )
}

export default BigButton;