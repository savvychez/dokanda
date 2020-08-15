import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom'
import { useData } from '../components/DataProvider';
import '../styles/form.css'



const Login = props => {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")

  const [err, setErr] = useState({})

  const { login, authenticated } = useData();

  useEffect(() => {
  }, [])

  const logCallback = (errMsg) => {
    setErr({ "msg": errMsg })
  }

  const formHandler = (e) => {
    e.preventDefault()
    login(email, pass, logCallback)
  }


  if (authenticated === false) {
    return (
      <div onClick={() => setErr({})}>
        <div className={`login-main ${err.classes}`}>
          <div className="login_container">
            <form className={"form_container"} onSubmit={formHandler}>
              <h1>Login</h1>
              <a href="register">Or create an account</a>
              <label htmlFor="email">Email</label>
              <input id="email" className={`text_field email ${err.classes}`} onClick={() => setErr({})} type="text" value={email} onChange={e => setEmail(e.target.value)} />

              <label htmlFor="password">Password</label>
              <input id="password" className={`text_field pass ${err.classes}`} onClick={() => setErr({})} type="password" value={pass} onChange={e => setPass(e.target.value)} />

              <button className="form-button">Sign In</button>
              <p className={`error-msg ${err.classes}`}>{err.msg}&nbsp;</p>
            </form>
          </div>
        </div>
      </div>
    )
  } else if (authenticated === true) { //Redirects to dashboard if user is authenticated
    return <Redirect to="/search" />
  } else {
    return <></>
  }
}

export default Login;

