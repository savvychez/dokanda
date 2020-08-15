import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './components/NavBar';
import DataProvider from './components/DataProvider';
import Register from './pages/Register'
import Choice from './pages/Choice';
import Chat from './pages/Chat';
import './assets/metropolis/metropolis.css'
import './styles/styles.css'
import Search from './pages/Search';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';


const App = () => {
  return (
    <DataProvider className="main-ctr">
      <NavBar />
      <div className="content">
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute path="/choice" component={Choice} />
            <PrivateRoute path="/search" component={Search} />
            <PrivateRoute path="/patient/chat" component={Chat} />
            <PrivateRoute path="/doctor/chat" component={Chat} />
            <Redirect to="/search" />
          </Switch>
        </Router>
      </div>
    </DataProvider>
  );
}

export default App;
