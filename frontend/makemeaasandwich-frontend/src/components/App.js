// Main component of our React side.

import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import { connect } from 'react-redux';
import history from '../history';
import jwt_decode from 'jwt-decode';
import SandwichService from './SandwichService';
import OrderList from './OrderList';
import OrderCreate from './OrderCreate';
import Header from './Header';
import Login from './Login';
import Profile from './Profile';
import Register from './Register';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from './PublicRoute';
import setAuthToken from '../setAuthToken';
import { setCurrentUser, logoutUser } from '../actions';
import store from '../store';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';

// Checking if there is token for user in 
// local storage.
if(localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);
    const decoded = jwt_decode(localStorage.jwtToken);
    store.dispatch(setCurrentUser(decoded));
  
    const currentTime = Date.now() / 1000;
    if(decoded.exp < currentTime) {
      store.dispatch(logoutUser());
      window.location.href = '/login'
    }
}

// The main component which is basically
// deciding which routes are shown based on user login status.
class App extends Component {
    
    render() {
        const { isAuthenticated } = this.props.auth;
        return (
            <div>
                <Router history={history}>
                    <div className="App">
                        <Header />
                        <PrivateRoute path="/" exact component={OrderCreate} authed={isAuthenticated} />
                        <PrivateRoute path="/" exact component={OrderList} authed={isAuthenticated} />
                        <PrivateRoute path="/sandwiches" exact component={SandwichService} authed={isAuthenticated} />
                        <PrivateRoute path="/profile" exact component={Profile} authed={isAuthenticated} />
                        <PublicRoute path="/register" exact component={Register} authed={isAuthenticated} />
                        <PublicRoute path="/login" exact component={Login} authed={isAuthenticated} />
                    </div>
                </Router>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps)(App);
