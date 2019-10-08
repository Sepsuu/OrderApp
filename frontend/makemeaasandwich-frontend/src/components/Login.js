// Our application Login component which
// renders the login page.

import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { loginUser, clearError } from '../actions';

// Login component which includes Redux form, form validation and lifecycle methods.
// Component creates action loginUser and provides rendering functionality.
// There is also error rendering.
class Login extends Component {
    
    componentWillUnmount() {
        this.props.clearError();
    }

    renderError({ error, touched }) {
        if (error && touched) {
            return (
                <div className="">
                    <div className="header">{error}</div>
                </div>
            );
        }
    }

    renderInput = ({ input, label, meta }) => {
        const type = input.name;
        return (
            <div>
                <br/>
                <input {...input} type={type} autoComplete="off" className='form-control form-control-lg' placeholder={label} />
                {this.renderError(meta)}
            </div>
        );
    }

    onSubmit = (formValues) => {
        this.props.loginUser(formValues);
    }

    render() {
        return(
            <div className="container" style={{ marginTop: '50px', width: '600px'}}>
                <h2>Welcome to the Sandwich Store</h2>
                <form onSubmit={this.props.handleSubmit(this.onSubmit)} >
                        <Field
                            className='form-control form-control-lg'
                            name="username" 
                            component={this.renderInput} 
                            label="Enter username"
                        />
                        <Field
                            className='form-control form-control-lg'
                            type="password"
                            name="password" 
                            component={this.renderInput}
                            label="Enter password"
                        />
                        <button 
                            style={{ marginTop: '30px'}} 
                            className="btn btn-success">
                                Login
                        </button>
                </form>
                { this.props.errors.description ? 
                    <div className="alert alert-warning" style={{marginTop: '40px'}} role="alert">
                        {this.props.errors.description.name}
                        <button type="button" className="close" aria-label="Close" onClick={this.props.clearError}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div> : ""
                }
            </div>
        )
    }
}

const validate = formValues => {
    const errors = {};
     if (!formValues.username) {
         errors.username = 'You must enter your username';
     }
     if (!formValues.email) {
         errors.email = 'You must enter your email';
     }
     if (!formValues.password) {
         errors.password = 'You must enter your password';
     }
     return errors;
 };

 const mapStateToProps = (state) => {
    return { 
        errors: state.errors
    };
}

const formWrapped = reduxForm({
    form: 'loginForm',
    validate
})(Login);

export default connect(mapStateToProps, { loginUser, clearError } )(formWrapped);