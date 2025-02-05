import axios from 'axios';
require("dotenv").config();

const apiClient = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MOVIEDB_API_TOKEN}`
    }
});

export default apiClient;