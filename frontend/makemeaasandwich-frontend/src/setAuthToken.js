// Helper file that is used in setting or deleting token to axios.

import axios from 'axios';

const setAuthToken = token => {
    if(token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    else {
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setAuthToken;