import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext)
}


export const DataProvider = props => {
    const user = {
        "id": "4",
        "prof": "g"
    }

    const [data, setData] = useState(user)

    useEffect(() => {
        //Runs on page load
    })

    //Write functions that call api here
    const test = () => {
        return "example"
    }

    const getRoomId = (callback) => {
        axios.get("/patient/chat").then(id => {callback(id)})
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

    const functions = {...data, setData, test, getProf, setProf, getRoomId /* Add every function you wrote above here */}
	return <DataContext.Provider value={functions} {...props} />
}

export default DataProvider