import axios from 'axios';

// We will use it for authentication

const instance = axios.create({
    baseURL:'http://localhost:5000/'
});

export default instance;
