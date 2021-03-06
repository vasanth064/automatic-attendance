import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';
import DescriptorsGenerator from './pages/DescriptorsGenerator';
import Home from './pages/Home';
import FirestoreProvider from './context/FirestoreContext.js';
import './App.css';

ReactDOM.render(
  <React.StrictMode>
    <FirestoreProvider>
      <Router>
        <nav>
          <NavLink to='/'>Home</NavLink>
          <NavLink to='/des'>Face Print Maker</NavLink>
        </nav>
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/des' component={DescriptorsGenerator} exact />
        </Switch>
      </Router>
    </FirestoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
