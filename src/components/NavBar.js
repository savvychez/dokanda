import React, { useState, useEffect } from 'react';
import '../styles/nav.css'
import "react-toggle/style.css"
import Toggle from 'react-toggle'
import USA from '../assets/usa.png'
import Indonesia from '../assets/indonesia.png'
import { Link, Redirect } from 'react-router-dom';
import { useData } from './DataProvider';


const NavBar = props => {
  const { authenticated, logout, setLang, lang } = useData();
  const [ checked, setChecked ] = useState(lang == "e")

  useEffect(() => {
    console.log(lang)
  }, [lang])


  const toggleCheck = () => {
    setChecked(!checked)
    setLang(lang == "e" ? "i" : "e")
  }

  const logoutFunc = (e) => {
    e.preventDefault()
    logout()
  }

  return (
    <div className="nav">
      <h1><a href="/">dokanda</a></h1>
      <Toggle className='checkedToggle' checked={checked} onChange={toggleCheck} icons={{
        checked: <img src={USA} />,
        unchecked: <img src={Indonesia} />,
      }} />
      {authenticated === true ? <a href="" onClick={logoutFunc}>{lang == 'e' ? "Logout" : "Keluar"}</a> : authenticated === false && <a href="/login" >{lang == 'e' ? "Login" : "Login"}</a>}
    </div>
  )
}

export default NavBar;