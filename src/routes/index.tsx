import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Import from '../pages/Import';
import Dashboard from '../pages/Dashboard';

const Routes: React.FC = () => (
  <Switch>
    <Route path='/' exact component={Dashboard} />
    <Route path='/import' component={Import} />
  </Switch>
);

export default Routes;
