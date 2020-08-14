import React, { useEffect, useState } from 'react';
import BigButton from '../components/BigButton';
import { FaNotesMedical, FaProcedures } from "react-icons/fa"
import '../styles/choices.css'
import { Redirect } from 'react-router';

const Choice = props => {
  const formHandler = (e) => {
    e.preventDefault();
    props.history.push("HH")
  }

  return (
    <form className="choices" onSubmit={formHandler}>
      <h1 className="choices-header">I am a...</h1>
      <div className="choices-ctr">
        <BigButton text="Doctor" icon={<FaNotesMedical size="32" />} />
        <BigButton text="Patient" icon={<FaProcedures size="32" />} />
      </div>
      <button>Continue</button>
    </form>
  )
}

export default Choice;

