// Index page for the reducers. This combines all the reducers.
// All the objects whose values are different reducing functions are turned into a single
// reducing function which is easy to pass to Redux createStore.

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import orderReducer from './orderReducer';
import authReducer from './authReducer';
import getUserReducer from './getUserReducer';
import errorReducer from './errorReducer';

export default combineReducers({
    orders: orderReducer,
    form: formReducer,
    auth: authReducer,
    user: getUserReducer,
    errors: errorReducer
});