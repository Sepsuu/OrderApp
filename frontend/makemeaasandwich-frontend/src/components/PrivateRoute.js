// Component of our application which checks
// authentication status and then decides if
// user is prompted to login page or is specific
// component shown.

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, authed, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      authed
        ? <Component {...props} />
        : <Redirect to="/login" />
    )}
  />
);

export default PrivateRoute;