import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import DataProvider from './components/DataProvider';
import Choice from './pages/Choice';
import './assets/metropolis/metropolis.css'
import './styles/styles.css'


const App = () => {
  return (
    <DataProvider>
      <Router>
        <Route path="/choice" component={Choice} />
        <Redirect to="/choice"/>
      </Router>
    </DataProvider>
  );
}

export default App;
