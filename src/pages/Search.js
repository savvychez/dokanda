import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa"
import { useData } from '../components/DataProvider';
import '../styles/search.css'
import MobileTable from '../components/MobileTable';
import { DebounceInput } from 'react-debounce-input';


const Search = props => {
  const { query } = useData();
  const [res, setRes] = useState([])
  const [input, setInput] = useState("")

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

  return (
    <div className="search">
      <DebounceInput className="input-field" type="text" placeholder="Enter Symptoms..." value={input} debounceTimeout={300} onChange={handleInput} />
      <MobileTable results={res} />
    </div>
  )
}

export default Search;

