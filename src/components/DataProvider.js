import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext)
}

export const DataProvider = props => {
    const user = {
        "id": "4"
    }

    const [data, setData] = useState(user)

    useEffect(() => {
        //Runs on page load
    })

    //Write functions that call api here

    const getRoomId = (callback) => {
        console.log(data.prof);
        if(data.prof==="patient")
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
                "data": [qString, "e"]
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

    const functions = { ...data, setData, getProf, setProf, getRoomId, query /* Add every function you wrote above here */ }
    return <DataContext.Provider value={functions} {...props} />
}

export default DataProvider