const express = require('express');
import { AxiosResponse } from 'axios';
import apiClient from '../axios/axios-config'
const logger = require('./middlewares/logger')
const app = express()
import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

const fun1 = (arg) => {
    arg.req.hello = 123
}

const fun2 = (arg) => {
    arg.req.world = 456
}

app.use(express.json())
app.use(logger([fun1, fun2]))
// 559969

app.get('/', async (req, res) => {
    // const response = await apiClient.get('/search/movie', {
    //     params: {
    //         'query': 'el camino'
    //     }
    // })

    res.json('ok')
})

//    - `POST /filme` → Adiciona um filme à lista de desejos. Busca informações na API externa e gera um identificador único.
app.post('/filme', async (req, res) => {

    const apiResponse = await apiClient.get<MovieDBMovie>('/search/movie', {
        params: {
            'query': req.nomeDoFilme
        }
    })
    const movieData: MovieDBMovie = apiResponse.data[0];
    let filme: Prisma.FilmeCreateInput = {
        moviedbId: 0,
        titulo: movieData.title,
        sinopse: movieData.overview,
        assistido: false,
        avaliado: 0,
        recomendado: false
    };
    prisma.filme.create({ data: filme })
    console.log(req);
})


//    - `GET /filme` → Lista todos os filmes na lista de desejos.
app.get('/filme', async (req, res) => {

})

//    - `GET /filme/:id` → Retorna detalhes de um filme específico.
app.get('/filme/:id', async (req, res) => {

})

//    - `PUT /filme/:id/estado` → Move o filme para um novo estado (ex: assistido, avaliado, recomendado).
app.put('/filme/:id/estado', async (req, res) => {

})

//    - `POST /filme/:id/avaliar` → Avalia o filme com uma nota de 0 a 5.
app.post('/filme/:id/avaliar', async (req, res) => {

})

//    - `GET /filme/:id/historico` → Retorna o histórico completo de um filme.
app.get('/filme/:id/historico', async (req, res) => {

})


//    - `GET /logs` → Retorna todos os logs registrados (para fins de debug).
app.get('/logs', async (req, res) => {

})

const server = app.listen(3000, () =>
    console.log('App ouvindo na porta 3000'))




