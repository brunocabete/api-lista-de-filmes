const express = require('express');
import apiClient from '../axios/axios-config'
const logger = require('./middlewares/logger')
const app = express()
import { query, validationResult, param } from 'express-validator';
import { PrismaClient, Prisma, Genero } from '@prisma/client'
import { MovieDBMovie } from './Interfaces/MovieDBMovie';
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
    try {

        const apiResponse = await apiClient.get<MovieDBMovie>('/search/movie', {
            params: {
                'query': encodeURI(req.body.nomeDoFilme),
                'language': 'pt-br'
            }
        })

        const movieData: MovieDBMovie = apiResponse.data;
        const firstMovie = movieData.results[0];

        const generos: any = await prisma.genero.findMany({
            where: {
                id: { in: firstMovie.genre_ids },
            },
            select: {
                id: true
            }
        })

        let filme: Prisma.FilmeCreateInput = {
            moviedbId: firstMovie.id,
            titulo: `${firstMovie.title} (${firstMovie.original_title})`,
            sinopse: firstMovie.overview,
            assistido: false,
            avaliado: 0,
            recomendado: false,
            generos: {
                connect: [
                    ...generos
                ]
            }
        };
        await prisma.filme.create({ data: filme })

        res.status(201).send("Filme inserido")

    } catch (err) {
        console.log(err)
        res.status(500).send("Erro ao inserir o filme")
    }
})


//    - `GET /filme` → Lista todos os filmes na lista de desejos.
app.get('/filme', async (req, res) => {
    try {
        const pagina: number = Number(req.query.pagina);

        let skip: number = 0;
        const take = 10;
        if (Number.isInteger(pagina) && pagina > 0) {
            skip = pagina - 1
            skip = skip * take
            console.log(skip)
        }
        const filmes = await prisma.filme.findMany({
            take: take,
            include: {
                generos: true
            },
            skip: skip,
        })
        res.set('max-pages', Math.ceil(await prisma.filme.count() / take))
        res.status(200).json(filmes)
    } catch (err) {
        console.log(err)
        res.status(500).send("falha")
    }
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




