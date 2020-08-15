import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useData } from './DataProvider'

const PrivateRoute = ({ component, ...options }) => {
	const {authenticated} = useData()
	if (authenticated === true) {
		return <Route {...options} component={component} />;
	} else if (authenticated === false) {
		return <Redirect to="/login"/>
	} else {
		return null
	}
}

export default PrivateRoute
