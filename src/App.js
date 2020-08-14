import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import DataProvider from './components/DataProvider';
import Choice from './pages/Choice';
import './assets/metropolis/metropolis.css'
import './styles/styles.css'
import Search from './pages/Search';


const App = () => {
  return (
    <DataProvider>
      <Router>
        <Switch>
          <Route path="/choice" component={Choice} />
          <Route path="/search" component={Search} />
          <Redirect to="/choice" />
        </Switch>
      </Router>
    </DataProvider>
  );
}

export default App;
