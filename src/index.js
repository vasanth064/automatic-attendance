import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import App from './App';
import DescriptorsGenerator from './DescriptorsGenerator';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path='/' component={App} exact />
        <Route path='/des' component={DescriptorsGenerator} exact />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
