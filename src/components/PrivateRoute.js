import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useData } from './DataProvider'

const PrivateRoute = ({ component, ...options }) => {
	const {authenticated} = useData()
	console.log("Authentication Status: " + authenticated)
	if (authenticated === true) {
		return <Route {...options} component={component} />;
	} else if (authenticated === false) {
		return <Redirect to="/login"/>
	} else {
		return <></>
	}
}

export default PrivateRoute
