import React, { useState, useEffect } from 'react';
import { useData } from '../components/DataProvider';
import '../styles/search.css'
import MobileTable from '../components/MobileTable';
import { DebounceInput } from 'react-debounce-input';
import SwitchModeButton from '../components/SwitchModeButton';


const Search = props => {
  const { getRoomId, query, lang, prof } = useData();
  const [res, setRes] = useState([])
  const [input, setInput] = useState("")

  useEffect(() => {
    query(" ", lang, resCallback)
  }, [])

  useEffect(() => {
    query(input, lang, resCallback)
  }, [lang])

  useEffect(() => {
    query(input, lang, resCallback)
  }, [input])

  const resCallback = (diseases) => {
    setRes(diseases)
  }

  const handleInput = (e) => {
    setInput(e.target.value)
  }

  const goToDoctor = (e) => {
    const selection = prof == "d" ? "doctor" : "patient"
    if(selection) {
      getRoomId((room_id) =>
        props.history.push(`${selection}/chat?name=${selection}&room=${room_id.data}`)
      , selection);
    }
  }

  return (
    <div className="search">
      <DebounceInput className="input-field search-input" type="text" placeholder={lang == 'e' ? "Enter Symptoms..." : "Masuk Gejala..."} value={input} debounceTimeout={300} onChange={handleInput} />
      <MobileTable results={res} />
      <SwitchModeButton onClick={goToDoctor} />
    </div>
  )
}

export default Search;

