import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext)
}

export const DataProvider = props => {
    const [data, setData] = useState(null)

    useEffect(() => {
        //Runs on page load
    })

    //Write functions that call api here
    const test = () => {
        return "example"
    }

    

    const functions = {...data, setData, test, /* Add every function you wrote above here */}
	return <DataContext.Provider value={functions} {...props} />
}

export default DataProvider