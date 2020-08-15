import React from 'react';
import '../styles/nav.css'
import "react-toggle/style.css"
import Toggle from 'react-toggle'
import USA from'../assets/usa.png'
import Indonesia from'../assets/indonesia.png'


const NavBar = ({ results }) => {
  return (
    <div className="nav">
      <h1>dokanda</h1>
      <Toggle className= 'checkedToggle' icons={{
      checked: <img src={USA}/>,
      unchecked: <img src={Indonesia}/>,
    }}/>
    </div>
  )
}

export default NavBar;