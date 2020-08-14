import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa"
import { useData } from '../components/DataProvider';
import '../styles/search.css'
import MobileTable from '../components/MobileTable';


const Search = props => {
  return (
    <div className="search">
      <input className="input-field" type="text" placeholder="Enter Symptoms..."/>
      <MobileTable/>
    </div>
  )
}

export default Search;

