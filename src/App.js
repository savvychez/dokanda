import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import DataProvider from './components/DataProvider';


const App = () => {
  return (
    <DataProvider>
      <Router>

      </Router>
    </DataProvider>
  );
}

export default App;
