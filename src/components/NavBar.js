import React, { useState } from 'react';
import '../styles/nav.css'
import "react-toggle/style.css"
import Toggle from 'react-toggle'
import USA from '../assets/usa.png'
import Indonesia from '../assets/indonesia.png'
import { Link, Redirect } from 'react-router-dom';
import { useData } from './DataProvider';


const NavBar = props => {
  const { authenticated, logout } = useData();
  const [ checked, setChecked ] = useState(true)
  const logoutFunc = (e) => {
    e.preventDefault()
    logout()
  }

  return (
    <div className="nav">
      <h1><a href="/">dokanda</a></h1>
      <Toggle className='checkedToggle' checked={checked} onChange={() => setChecked(!checked)} icons={{
        checked: <img src={USA} />,
        unchecked: <img src={Indonesia} />,
      }} />
      {authenticated === true ? <a href="" onClick={logoutFunc}>Logout</a> : authenticated === false && <a href="/login" >Login</a>}
    </div>
  )
}

export default NavBar;