// Reducer for the getting the user information to profile page.
// It is only returning the payload from the action.

import { GET_USER } from '../actions/type';

const initialState = {};

export default (state = initialState, action ) => {
    switch(action.type) {
        case GET_USER:
            return action.payload;
        default: 
            return state;
    }
}