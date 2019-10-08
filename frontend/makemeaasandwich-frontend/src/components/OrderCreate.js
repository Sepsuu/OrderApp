// Our application Component which is used to order a sandwich.

import React from 'react';
import { Field, reset, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { createOrder } from '../actions';
import '../styles/OrderCreate.css';

// OrderCreate component which includes Redux form,
// createOrder action creator, form clearing action creator
// and rendering functionality.
// There is also error rendering.
class OrderCreate extends React.Component {

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
        return (
            <div>
                <br/>
                <input {...input} autoComplete="off" className='form-control form-control-lg' placeholder={label}/>
                {this.renderError(meta)}
            </div>
        );
    }

    onSubmit = (formValues, dispatch) => {
        this.props.createOrder(formValues, this.props.orders);
        dispatch(reset("orderCreate"));
    }

    render() {
        return (
            <div className="container" style={{ marginTop: '50px', width: '600px'}}>
                <h1 style={{color: "green"}}>Hello, {this.props.auth.user.name}</h1>
                <br/>
                <h1>Place your order</h1>
                <form onSubmit={this.props.handleSubmit(this.onSubmit)} >
                    <Field
                        className='form-control form-control-lg'
                        name="sandwichId" 
                        component={this.renderInput} 
                        label="Enter sandwichId"
                    />
                    <button style={{ marginTop: '30px'}} className="btn btn-success">Submit</button>
                </form>
                <hr/>
            </div>
        );
    }

}

const validate = formValues => {
   const errors = {};
    if (!formValues.sandwichId) {
        errors.sandwichId = 'You must enter a sandwichId';
    }
    if (isNaN(Number(formValues.sandwichId))){
        errors.sandwichId = 'You must enter a number';
    }
    return errors;
};

const mapStateToProps = (state) => {
    return { 
        orders: state.orders,
        auth: state.auth
    };
}

const formWrapped = reduxForm({
    form: 'orderCreate',
    validate
})(OrderCreate);

export default connect(mapStateToProps, { createOrder })(formWrapped);