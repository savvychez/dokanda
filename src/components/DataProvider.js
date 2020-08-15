import React, { createContext, useContext, useState, useEffect } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';

export const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext)
}

export const DataProvider = props => {
    const user = {
        "authenticated" : false
    }

    const [data, setData] = useState(user)

    useEffect(() => {
        var authToken = cookie.load('auth-token')
		if (authToken) {
			axios.post(
				'/api/registerUser',
				{ authtoken: authToken, }
			)
				.then(res => {
					if (res.data.success) {
                        let old = data;
                        old.authenticated = true;
                        setData(old)
                    }
					else {
                        let old = data;
                        old.authenticated = false;
                        setData(old)
                    }
				})
				.catch(err => {
					console.log(err)
				})
		} else {
			setAuthData({ "authenticated": false })
		}
    })

    //Write functions that call api here

    const getRoomId = (callback, prof) => {
        // console.log(data.prof);
        if(prof==="patient")
            axios.get("/patient/chat").then(id => {callback(id)})
        else
        {
            axios.get("/doctor/chat").then(id => {callback(id)})
        }
    }

    const getProf = () => {
        return data.prof;
    }

    const setProf = (prof) => {
        setData({
            ...data,
            "prof": prof
        })
    }

    //SEARCH FUNCTIONS
    const query = (qString, lang, callback) => {
        axios.post(
            "/api/matching",
            {
                "data": [qString, lang]
            }
        )
            .then(res => {
                if (res.data.auth_token) {
                    callback(res.data.auth_token)
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    //AUTH FUNCTIONS
    const register = (fName, lName, email, pharmacy, pass, callback) => {
        console.log("Reg")
        axios.post(
            "/api/registerUser",
            {
                "firstName" : fName,
                "lastName" : lName,
                "email" : email,
                "password" : pass,
                "pharmacy" : pharmacy
            }
        )
            .then(res => {
                console.log(res.data)
                if (res.data.auth_token) {
					cookie.save('auth-token', res.data.auth_token, { 'path': '/' });
                    callback(res.data.auth_token, true)
                } else {
                    callback(res.data.statusMessage, false)
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    const functions = { ...data, setData, getProf, setProf, getRoomId, query, register /* Add every function you wrote above here */ }
    return <DataContext.Provider value={functions} {...props} />
}

export default DataProvider