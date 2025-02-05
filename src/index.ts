import express from 'express'
import apiClient from '../axios/axios-config';
require("dotenv").config();
const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
   const response = await apiClient.get('/search/movie', {
        params: {
            'query': 'el camino'
        }
    })
    console.log(response.data)
})


const server = app.listen(3000, () =>
    console.log('App ouvindo na porta 3000'))