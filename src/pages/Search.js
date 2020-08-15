import React, { useState, useEffect } from 'react';
import { useData } from '../components/DataProvider';
import '../styles/search.css'
import MobileTable from '../components/MobileTable';
import { DebounceInput } from 'react-debounce-input';
import SwitchModeButton from '../components/SwitchModeButton';


const Search = props => {
  const { query } = useData();
  const [res, setRes] = useState([])
  const [input, setInput] = useState("")

  useEffect(() => {
    query(input, "e", resCallback)
  },[])

  useEffect(() => {
    console.log(input);
    query(input, "e", resCallback)
  }, [input])

  const resCallback = (diseases) => {
    setRes(diseases)
  }

  const handleInput = (e) => {
    setInput(e.target.value)
  }

  const goToDoctor = (e) => {
    props.history.push("/patient/chat")
  }

  return (
    <div className="search">
      <DebounceInput className="input-field search-input" type="text" placeholder="Enter Symptoms..." value={input} debounceTimeout={300} onChange={handleInput} />
      <MobileTable results={res} />
      <SwitchModeButton onClick={goToDoctor}/>
    </div>
  )
}

export default Search;

