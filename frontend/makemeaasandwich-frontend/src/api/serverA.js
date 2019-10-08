// Initializing axios instance

import axios from 'axios';

export default axios.create({
    baseURL: "http://localhost:12345/v1/"
});