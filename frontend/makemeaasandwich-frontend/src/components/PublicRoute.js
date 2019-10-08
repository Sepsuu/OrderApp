// Component of our application which checks
// authentication status and then decides if
// user is prompted to 'home' page or is specific
// component shown.

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({ component: Component, authed, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      !authed
        ? <Component {...props} />
        : <Redirect to="/" />
    )}
  />
);

export default PublicRoute;