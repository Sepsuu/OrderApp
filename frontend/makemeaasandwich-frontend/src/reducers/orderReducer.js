// Reducer for the getting the orders to application.
// It is only returning the payload from the action.

import { FETCH_ORDER } from "../actions/type";

export default (state = [], action) => {
    switch (action.type) {
        case FETCH_ORDER:
            return action.payload;
        default:
            return state;
    }
};