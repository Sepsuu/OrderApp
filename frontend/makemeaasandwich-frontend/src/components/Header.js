// Application header component which is always showed.

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser, clearError } from '../actions';
import '../styles/Header.css';

// Header component which renders different texts 
// and links based on user login status.
class Header extends Component {

    render() {
        const { isAuthenticated } = this.props.auth;
        const authLinks = (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to="/sandwiches" >All sandwiches</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/profile" >Profile</Link>
                </li>
                <li>
                    <Link className="nav-link" to="/login" onClick={() => {this.props.logoutUser()}} >Logout</Link>
                </li>
            </ul>
        )
        const guestLinks = (
            <ul className="navbar-nav ml-auto">
                <li>
                    <Link className="nav-link" to="/login" >Login</Link>
                </li>
                <li>
                    <Link className="nav-link" to="/register" onClick={() => {this.props.clearError()}}>Register</Link>
                </li>
            </ul>
        )
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow p-3 mb-5 bg-white rounded">
                <Link className="navbar-brand" to="/">Your own sandwich service!</Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {isAuthenticated ? authLinks : guestLinks}
                </div>
            </nav>

        );
    }
};

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser, clearError })(Header);