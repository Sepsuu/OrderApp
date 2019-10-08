import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { registerUser, clearError } from '../actions';

// Register component creates action registerUser.  
// This component uses Redux form, form validation and lifecycle methods.
// There is also error rendering functionality.
class Register extends Component {

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
        this.props.registerUser(formValues);
    }

    render() {
        return(
            <div className="container" style={{ marginTop: '50px', width: '600px'}}>
                <h2>Register</h2>
                <form onSubmit={this.props.handleSubmit(this.onSubmit)} >
                    <Field
                        className='form-control form-control-lg'
                        name="username" 
                        component={this.renderInput} 
                        label="Enter name"
                    />
                    <Field
                        className='form-control form-control-lg'
                        name="email" 
                        component={this.renderInput}
                        label="Enter email"
                    />
                    <Field
                        className='form-control form-control-lg'
                        type="password"
                        name="password" 
                        component={this.renderInput}
                        label="Enter password"
                    />
                    <button 
                        style={{ marginTop: '35px'}} 
                        className="btn btn-primary">
                            Register user
                    </button>
                </form>
                { this.props.errors.description ? 
                        <div className="alert alert-warning" style={{marginTop: '40px'}} role="alert">
                            {this.props.errors.description}
                            <button type="button" className="close" aria-label="Close" onClick={this.props.clearError}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div> : ""
                }
            </div>
        );
    }
}

const validate = formValues => {
    const errors = {};
     if (!formValues.username) {
         errors.username = 'You must enter your username';
     }
     if (formValues.username && formValues.username.length < 2) {
         errors.username = "Username should be at least 2 characters"
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
    form: 'registerForm',
    validate
})(Register);

export default connect(mapStateToProps, { registerUser, clearError })(formWrapped);