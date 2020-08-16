import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { useData } from '../components/DataProvider';
import '../styles/form.css'



const Register = props => {

  const [fName, setFName] = useState("")
  const [lName, setLName] = useState("")
  const [email, setEmail] = useState("")
  const [pharmacy, setPharmacy] = useState("")
  const [pass, setPass] = useState("")
  const [selectedP, setSelectedP] = useState(true)

  const [err, setErr] = useState({})

  const { translate, register, authenticated, lang } = useData();

  const regCallback = (authMessage, success) => {
    if (success) {
      console.log(authMessage);
      props.history.push("/search")
    } else {
      setErr({ "msg": authMessage })
    }
  }

  const formHandler = (e) => {
    e.preventDefault()
    if (!fName || !lName || !email || !pharmacy || !pass) {
      setErr({ "msg": `One or more fields are empty!` })
    } else if (!validate(email)) {
      setErr({ "msg": "Email not valid" })
    } else {
      const selected = selectedP ? "p" : "d"
      register(fName, lName, email, pharmacy, pass, selected, regCallback)
    }
  }

  const validate = (mail) => {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  }


  if (authenticated === false) {
    return (
      <div onClick={() => setErr({})}>
        <div className={`login-main ${err.classes}`}>
          <div className="login_container">
            <form className={"form_container"} onSubmit={formHandler}>
              <h1 className="register">{lang === 'e' ? "Register" : "Daftar"}</h1>
              <Link to="/login">{lang === 'e' ? "Have an account? Login" : "Punya akun? Login"}</Link>

              <label htmlFor="firstname">{lang === 'e' ? "First Name" : "Nama depan"}</label>
              <input id="firstname" className={`text_field fname ${err.classes}`} onClick={() => setErr({})} type="text" value={fName} onChange={e => setFName(e.target.value)} />

              <label htmlFor="lastname">{lang == 'e' ? "Last Name" : "Nama belakang"}</label>
              <input id="lastname" className={`text_field lname ${err.classes}`} onClick={() => setErr({})} type="text" value={lName} onChange={e => setLName(e.target.value)} />

              <label htmlFor="email">{lang == 'e' ? "Email" : "Email"}</label>
              <input id="email" className={`text_field email ${err.classes}`} onClick={() => setErr({})} type="text" value={email} onChange={e => setEmail(e.target.value)} />

              <label htmlFor="pharmacy">{lang == 'e' ? "Pharmacy Address" : "Alamat Apotek"}</label>
              <input id="pharmacy" className={`text_field pharmacy ${err.classes}`} onClick={() => setErr({})} type="username" value={pharmacy} onChange={e => setPharmacy(e.target.value)} />

              <label htmlFor="password">{lang == 'e' ? "Password" : "Password"}</label>
              <input id="password" className={`text_field pass ${err.classes}`} onClick={() => setErr({})} type="password" value={pass} onChange={e => setPass(e.target.value)} />

              <label htmlFor="">{lang == 'e' ? "I am a..." : "Apa profesimu?"}</label>
              <div className="radio_container">
                <input type="radio" id="p" name="prof" checked={selectedP} onChange={() => setSelectedP(!selectedP)}/>
                <label htmlFor="p">{lang == 'e' ? "Patient" : "Pasien"}</label>
                <br />
                <input type="radio" id="d" name="prof" checked={!selectedP} onChange={() => setSelectedP(!selectedP)}/>
                <label htmlFor="d">{lang == 'e' ? "Doctor" : "Dokter"}</label>
              </div>

              <button className="form-button">Register</button>
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
  } else {
    return <></>
  }
}

export default Register;

