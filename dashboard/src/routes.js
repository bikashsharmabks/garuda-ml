import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

// Containers
import Full from './containers/Full/'

import Home from './views/Home/Home'

export default (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={Full}>
      <IndexRoute component={Home}/>
      <Route path="/" name="Home" component={Home}/>
    </Route>
  </Router>
);
