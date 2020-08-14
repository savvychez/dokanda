import React from 'react';
import { FaPhoneAlt } from "react-icons/fa"
import '../styles/SwitchModeButton.css'

const SwitchModeButton = props => {
  return (
    <button className="switchButton" onClick={props.onClick}>Doctor<FaPhoneAlt size="40"/></button>
  )
}

export default SwitchModeButton;