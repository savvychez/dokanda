import React, { createContext, useContext, useState, useEffect } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';

export const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext)
}

export const DataProvider = props => {
    let user = {
        "authenticated": "PENDING",
        "lang": cookie.load('lang') || "e"
    }

    const [data, setData] = useState(user)

    useEffect(() => {
        var authToken = cookie.load('auth-token')
        if (authToken) {
            axios.post(
                '/api/confirmAuthToken',
                { auth_token: authToken, }
            )
                .then(res => {
                    let copy = { ...data };
                    if (res.data.success) {
                        copy.authenticated = true;
                    }
                    else {
                        copy.authenticated = false;
                    }
                    setData(copy)
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            let copy = { ...data };
            copy.authenticated = false;
            setData(copy);
        }
    }, [])

    useEffect(() => {
        console.log(data)
    }, [data])

    //Write functions that call api here

    const getRoomId = (callback, prof) => {
        // console.log(data.prof);
        if (prof === "patient")
            axios.get("/patient/chat").then(id => { callback(id) })
        else {
            axios.get("/doctor/chat").then(id => { callback(id) })
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

    const getLang = () => {
        return data.lang;
    }

    const setLang = (lang) => {
        setData({
            ...data,
            "lang": lang
        })
        cookie.save("lang", lang, { 'path': '/' })
    }

    const translate = (str, callback) => {
        var lang = cookie.load('lang');
        let translation;
        axios.post(
            "/api/translate",
            {
                "text": str,
                "lang": lang
            }
        ).then(res => {
            if (res.data.text) {
                translation = res.data.text
                console.log(translation)
                callback(translation);
            } else {
                console.log(res.data)
            }
        })
    }

    //SEARCH FUNCTIONS
    const query = (qString, lang, callback) => {
        axios.post(
            "/api/matching",
            {
                "data": [qString, data.lang]
            }
        )
            .then(res => {
                if (res.data.matchingDiseases) {
                    callback(res.data.matchingDiseases)
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    //AUTH FUNCTIONS
    const register = (fName, lName, email, pharmacy, pass, profession, callback) => {
        axios.post(
            "/api/registerUser",
            {
                "firstName": fName,
                "lastName": lName,
                "email": email,
                "password": pass,
                "pharmacy": pharmacy,
                "profession": profession
            }
        )
            .then(res => {
                console.log(res.data)
                if (res.data.auth_token) {
                    cookie.save('auth-token', res.data.auth_token, { 'path': '/' });
                    callback(res.data.auth_token, true)
                    let copy = { ...data };
                    copy.authenticated = true;
                    setData(copy);

                } else {
                    callback(res.data.statusMessage, false)
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    const login = (email, password, callback) => {
        axios.post(
            '/api/login',
            { email: email, password: password }
        ).then(res => {
            if (res.data.success) {
                console.log("Logged In!")
                cookie.save("auth-token", res.data.auth_token, { 'path': '/' })
                let copy = { ...data };
                copy.authenticated = true;
                setData(copy);
            } else {
                callback("Login Failed!")
            }
        }).catch(err => {
            console.error(err)
        })
    }

    const logout = () => {
        console.log("BEGIN LOG OUT")
        var authToken = cookie.load('auth-token')
        if (authToken) {
            axios.post(
                '/api/confirmAuthToken',
                { auth_token: authToken, }
            ).then(res => {
                if (res.data.success) {
                    console.log("Logged Out!")
                    cookie.remove("auth-token")
                    let copy = { ...data };
                    copy.authenticated = false;
                    setData(copy);
                }
            }).catch(err => {
                console.log("LOG OUT ERROR")
                console.log(err)
                console.error(err)
            })
        }
    }

    const functions = { ...data, translate, setData, getProf, setProf, getLang, setLang, getRoomId, query, register, login, logout }
    return <DataContext.Provider value={functions} {...props} />
}

export default DataProvider