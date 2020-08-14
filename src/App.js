import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './components/NavBar';
import DataProvider from './components/DataProvider';
import Choice from './pages/Choice';
import Chat from './pages/Chat';
import './assets/metropolis/metropolis.css'
import './styles/styles.css'
import Search from './pages/Search';


const App = () => {
  return (
    <DataProvider>
      <NavBar />
      <Router>
        <Switch>
          <Route path="/choice" component={Choice} />
          <Route path="/search" component={Search} />
          <Route path="/patient/chat" component={Chat} />
          <Route path="/doctor/chat" component={Chat} />
          <Redirect to="/choice" />
        </Switch>
      </Router>
    </DataProvider>
  );
}

export default App;
