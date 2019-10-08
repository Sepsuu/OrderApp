// All the application actions. Actions sends data to our Redux store.

import jwt_decode from 'jwt-decode';
import history from '../history';
import serverA from '../api/serverA';
import setAuthToken from '../setAuthToken';
import { FETCH_ORDER, GET_ERRORS, SET_CURRENT_USER, GET_USER } from './type';

// This action fetch all the orders from the database using the path /order.
export const fetchOrders = () => async dispatch => {
    const response = await serverA.get('/order');
    dispatch({type: FETCH_ORDER, payload: response.data});
};

// Create order action will create an order for user. It automatically
// makes orderId based on the orders in the backend.
export const createOrder = (formValues, orders) => async dispatch => {
    if(orders.length === 0) {
        formValues.id = 1;
    }
    else {
        formValues.id = orders[orders.length -1].orderId + 1;   
    }
    const order = {};
    order["order"] = formValues;
    const response = await serverA.post('/order', order, {
        headers: {
            'Content-Type' : 'application/json'
        }
    });
    const data = response.data;
    dispatch({type: FETCH_ORDER, payload: [...orders, data]});
};

// This action will delete order and for that it uses 
// DELETE request which is sent to path /order/orderId.
export const deleteOrder = (orderId, orders) => async dispatch => {
    await serverA.delete(`/order/${orderId}`);
    const afterDelete = orders.filter(item =>{ return item.orderId !== orderId });
    dispatch({type: FETCH_ORDER, payload: afterDelete});
}

// registerUser action forms a random id for the user and makes a POST
// request to backend server including all the user data.
// Action also handles register errors.
export const registerUser = (formValues) => async dispatch => {
    var id = Math.floor(Math.random() * 1000000000);
    formValues['id'] = id;
    id++;
    const response = await serverA.post('/user', formValues, {
        headers: {
            'Content-Type' : 'application/json'
        }
    });
    if(response.data.description != null) {
        var object = {};
        if(response.data.description.name === "MongoError") {
            object.description = "Email account is already used"
        }
        else {
            object.description = response.data.description;
        }
        dispatch({type: GET_ERRORS, payload: object});
    }
    else {
        history.push('/login');
    }
}

// This action will login the user and set up the session token.
// Token is stored to local storage.
// Action also handles login errors.
export const loginUser = (formValues) => async dispatch => {
    localStorage.clear()
    const response = await serverA.post('/user/login', formValues)
    const { token } = response.data;
    if(token != null) {
        localStorage.setItem('jwtToken', token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
        history.push('/');
    }
    else {
        dispatch({type: GET_ERRORS, payload: response.data});
    }
}

// setCurrent user is action which is used in the login action.
// It only dispatches SET_CURRENT_USER action which is handled
// in the authReducer.
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

// This action will logout the user and remove the session token
// from the local storage.
export const logoutUser = () => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    history.push('/login');
    dispatch({type: GET_ERRORS, payload: ""});
}

// getUser action makes a GET request to backend server.
// This action is used in profile page.
export const getUser = (username) => async dispatch => {
    const response = await serverA.get(`/user/${username}`, {
        headers: {
            'Content-Type' : 'application/json'
        }
    });
    dispatch({type: GET_USER, payload: response.data});
}

// This action is also used in profile page and it makes a PUT
// request to backend server including updated user information.
// Action also handles update user errors.
export const updateUser = (username, formValues) => async dispatch => {
    const response = await serverA.put(`/user/${username}`, formValues, {
        headers: {
            'Content-Type' : 'application/json'
        }
    });
    if(response.data.status === 200) {
        dispatch(logoutUser({}));
    }
    else {
        dispatch({type: GET_ERRORS, payload: response.data});
    }
    
}

// deleteUser is action which is used in profile page and it makes a
// DELETE request to path user/username. 
export const deleteUser = (username) => async dispatch => {
    const response =  await serverA.delete(`/user/${username}`);
    console.log(response);
    if(response.data.status === 200) {
        dispatch(logoutUser({}));
    } else {
        dispatch({type: GET_ERRORS, payload: response.data});
    }
}

// This action which is used in login errors.
export const clearError = () => dispatch => {
    dispatch({type: GET_ERRORS, payload: ""});
}
