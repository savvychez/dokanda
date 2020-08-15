import React, { useState } from 'react';
import BigButton from '../components/BigButton';
import { FaNotesMedical, FaProcedures } from "react-icons/fa"
import { useData } from '../components/DataProvider';
import '../styles/choices.css'
import { select } from 'react-cookies';


const Choice = props => {

  const [selection, setSelection] = useState(false)
  const { getRoomId, setProf } = useData()
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')

  const formHandler = (e) => {
    e.preventDefault()
    if(selection) {
      setProf(selection)
      getRoomId((room_id) =>
        props.history.push(`${selection}/chat?name=${selection}&room=${room_id.data}`)
      , name);
    }
  }

  const clickDoctor = () => {
    setSelection("doctor")
    setName("doctor")
    setRoom("Appointment");
  }

  const clickPatient = () => {
    setSelection("patient")
    setName("patient");
    setRoom("Appointment");
  }


  return (
    <form className="choices" onSubmit={formHandler}>
      <h1 className="choices-header">I am a...</h1>
      <div className="choices-ctr">
        <BigButton className={`doc ${selection}`} text="Doctor" onClick={clickDoctor} icon={<FaNotesMedical size="32"  />} />
        <BigButton className={`pat ${selection}`} text="Patient" onClick={clickPatient} icon={<FaProcedures size="32" />} />
      </div>
      <button>Continue</button>
    </form>
  )
}

export default Choice;

