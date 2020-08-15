import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom'
import { useData } from '../components/DataProvider';
import '../styles/form.css'



const Register = props => {
  const [fName, setFName] = useState("")
  const [lName, setLName] = useState("")
  const [email, setEmail] = useState("")
  const [pharmacy, setPharmacy] = useState("")
  const [pass, setPass] = useState("")

  const [err, setErr] = useState({})

  const { register, authenticated } = useData();

  useEffect(() => {
  }, [])

  const regCallback = (authMessage, success) => {
    if (success) {
      console.log(authMessage);
      props.history.push("/choice")
    } else {
      setErr({ "msg": "One or more fields are empty!" })
    }
  }

  const formHandler = (e) => {
    e.preventDefault()
    if (!fName || !lName || !email || !pharmacy || !pass || !regCallback) {
      setErr({ "msg": "One or more fields are empty!" })
    } else if (!validate(email)) {
      setErr({ "msg": "Email not valid" })
    }else {
      register(fName, lName, email, pharmacy, pass, regCallback)
    }
  }


  function validate(mail) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  }

  if (authenticated === false) {
    return (
      <div onClick={() => setErr({})}>
        <div className={`login-main ${err.classes}`}>
          <div className="login_container">
            <form className={"form_container"} onSubmit={formHandler}>
              <h1>Register</h1>
              <label htmlFor="firstname">First Name</label>
              <input id="firstname" className={`text_field fname ${err.classes}`} onClick={() => setErr({})} type="text" value={fName} onChange={e => setFName(e.target.value)} />

              <label htmlFor="lastname">Last Name</label>
              <input id="lastname" className={`text_field lname ${err.classes}`} onClick={() => setErr({})} type="text" value={lName} onChange={e => setLName(e.target.value)} />

              <label htmlFor="email">Email</label>
              <input id="email" className={`text_field email ${err.classes}`} onClick={() => setErr({})} type="text" value={email} onChange={e => setEmail(e.target.value)} />

              <label htmlFor="pharmacy">Pharmacy Address</label>
              <input id="pharmacy" className={`text_field pharmacy ${err.classes}`} onClick={() => setErr({})} type="username" value={pharmacy} onChange={e => setPharmacy(e.target.value)} />

              <label htmlFor="password">Password</label>
              <input id="password" className={`text_field pass ${err.classes}`} onClick={() => setErr({})} type="password" value={pass} onChange={e => setPass(e.target.value)} />

              <button className="button">Register</button>
              <p className={`error-msg ${err.classes}`}>{err.msg}&nbsp;</p>
            </form>
          </div>
        </div>
      </div>
    )
  } else if (authenticated === true) { //Redirects to dashboard if user is authenticated
    return (
      <Redirect to="/app" />
    )
  }
}

export default Register;

