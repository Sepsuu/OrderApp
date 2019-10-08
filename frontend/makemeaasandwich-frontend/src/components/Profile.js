// Profile page of our application is rendered by this component.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { getUser, updateUser, deleteUser, clearError } from '../actions';
import '../styles/Profile.css';

// Profile component creates actions like getUser and
// updateUser. This component uses Redux form, form validation and lifecycle methods.
// There is also error rendering functionality.
class Profile extends Component {

    componentDidMount() {
        this.props.getUser(this.props.auth.user.name);
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
                <h4>{label}</h4>
                <input {...input} type={type} autoComplete="off" className='form-control form-control-lg'/> 
                {this.renderError(meta)}
                <br/>
            </div>
        );
    }

    onSubmit = (formValues) => {
        this.props.updateUser(this.props.auth.user.name,formValues);
    }

    onDelete = () => {
        this.props.deleteUser(this.props.auth.user.name);
    }

    render() {
        return (
            <div className="container" style={{ marginTop: '50px', width: '600px'}}>
                <h2>Profile</h2>
                <br/>
                <form onSubmit={this.props.handleSubmit(this.onSubmit)} >
                    <Field
                        className='form-control form-control-lg'
                        name="username" 
                        component={this.renderInput} 
                        label="Edit username"
                    />
                    <Field
                        className='form-control form-control-lg'
                        name="email" 
                        component={this.renderInput} 
                        label="Edit email"
                    />
                    <Field
                        className='form-control form-control-lg'
                        name="password" 
                        component={this.renderInput}
                        label="Enter new password"
                    />
                    <button style={{ marginTop: '35px', float: 'right'}} className="btn btn-primary">Submit</button>
                </form>
                <button style={{ marginTop: '35px', float: 'left'}} onClick={this.onDelete} className="btn btn-danger">Delete user</button>
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
     if (!formValues.email) {
         errors.email = 'You must enter your email';
     }
     if (!formValues.password) {
         errors.password = 'You must enter your password';
     }
     return errors;
 };

const mapStateToProps = (state) => ({
    auth: state.auth,
    user: state.user,
    initialValues: state.user,
    errors: state.errors
})

const formWrapped = reduxForm({
    form: 'profile',
    enableReinitialize: true,
    validate
})(Profile);

export default connect(mapStateToProps, { getUser, updateUser, deleteUser, clearError })(formWrapped);