import React from 'react';
import { FaPhoneAlt } from "react-icons/fa"
import '../styles/SwitchModeButton.css'
import { useData } from './DataProvider';

const SwitchModeButton = props => {
  const { lang } = useData();

  return (
    <button className="switchButton" onClick={props.onClick}>{lang == 'e' ? "Doctor" : "Dokter"}<FaPhoneAlt size="40"/></button>
  )
}

export default SwitchModeButton;