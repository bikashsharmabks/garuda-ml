import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import ReactGA from 'react-ga';
import Full from './containers/Full/'
import Home from './views/Home/Home'


ReactGA.initialize('UA-120668996-2'); 

function fireTracking() {
  ReactGA.pageview(window.location.hash);
}

export default (
  <Router onUpdate={fireTracking}  history={hashHistory}>
    <Route path="/" name="Home" component={Full}>
      <IndexRoute component={Home}/>
      <Route path="/" name="Home" component={Home}/>
    </Route>
  </Router>
);
