// Reducer which is used clearing or showing the application errors.
// Actions like clearError uses this reducer.
// It is only returning the payload from the action.

import { GET_ERRORS } from '../actions/type';

const initialState = {};

export default (state = initialState, action ) => {
    switch(action.type) {
        case GET_ERRORS:
            return action.payload;
        default: 
            return state;
    }
}