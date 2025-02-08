const express = require('express');
import apiClient from '../axios/axios-config'
const logger = require('./middlewares/logger')
const app = express()
import { PrismaClient, Prisma, Filme, Log } from '@prisma/client'
import { MovieDBMovie } from './Interfaces/MovieDBMovie';
import { log1_geral } from './middlewares/log1_geral';
import { log2_erro } from './middlewares/log2_erro';
import { requireAuth } from './middlewares/requireAuth';
const session = require('express-session');

const prisma = new PrismaClient()


app.use(express.json())
const logFilmeMiddleware = logger([log1_geral, log2_erro]);


app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.post('/login', (req, res) => {
    const validCredentials = req.body.password == 'hello';
    const userId = 1;
    if (validCredentials) {
        req.session.userId = userId; // Set session identifier
        res.status(200).send('Login feito com sucesso')
    } else {
        res.status(400).send('Algo deu errado')
    }
});
app.post('/filme', [requireAuth, logFilmeMiddleware], async (req, res) => {
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
            avaliado: null,
            recomendado: false,
            generos: {
                connect: [
                    ...generos
                ]
            }
        };
        await prisma.filme.create({ data: filme })

        return res.status(201).send("Filme inserido")

    } catch (err) {
        console.log(err)
        return res.status(500).send("Erro ao inserir o filme")
    }
})


app.get('/filme', [requireAuth, logFilmeMiddleware], async (req, res) => {
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
        return res.status(200).json(filmes)
    } catch (err) {
        console.log(err)
        return res.status(500).send("falha")
    }
})

//    - `GET /filme/:id` → Retorna detalhes de um filme específico.
app.get('/filme/:id', [requireAuth, logFilmeMiddleware], async (req, res) => {
    try {

        let filme: Filme = await prisma.filme.findUniqueOrThrow({
            where: {
                id: Number(req.params.id)
            }
        })

        return res.status(200).json(filme)
    } catch (err: any) {
        if (err.code == 'P2025') {
            return res.status(404).send('Não encontrado')
        } else {
            return res.status(500).send('Algo deu errado')
        }

    }
})

//    - `PUT /filme/:id/estado` → Move o filme para um novo estado (ex: assistido, avaliado, recomendado).
app.put('/filme/:id/assistir', [requireAuth, logFilmeMiddleware], async (req, res) => {
    try {

        await prisma.filme.update(
            {
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    assistido: true
                }
            }
        )
        return res.status(200).send('assistido')
    } catch (err) {
        return res.status(400).send('filme nao encontrado')
    }
})

app.put('/filme/:id/desassistir', [requireAuth, logFilmeMiddleware], async (req, res) => {
    try {
        await prisma.filme.update(
            {
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    assistido: false,
                    recomendado: false,
                    avaliado: null
                }
            }
        )
    } catch (err) {
        console.log(err)
    }
})

app.post('/filme/:id/avaliar', [requireAuth, logFilmeMiddleware], async (req, res) => {
    try {
        let nota = Number(req.query.nota.replaceAll(',', '.'))
        if (nota > 5) {
            nota = 5
        }
        if (nota < 0) {
            nota = 0
        }
        let filme: Filme = await prisma.filme.findUniqueOrThrow({
            where: {
                id: Number(req.params.id)
            }
        })
        if (filme.assistido == false) {
            return res.status(422).send('O filme precisa ser assitido antes de ser avaliado')
        }
        await prisma.filme.update(
            {
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    avaliado: nota
                }
            }
        )
        return res.status(200).send('Filme avaliado')

    } catch (err) {
        console.log(err)
    }
})

//    - `GET /filme/:id/historico` → Retorna o histórico completo de um filme.
app.get('/filme/:id/historico', [requireAuth, logFilmeMiddleware], async (req, res) => {
    try {
        const historico = await prisma.log.findMany(
            {
                where: {
                    AND: {
                        filmeId: Number(req.params.id),
                        usuarioId: Number(req.session.userId)
                    }
                }
            }
        )
        res.status(200).json(historico)
    } catch (err) {

    }
})


//    - `GET /logs` → Retorna todos os logs registrados (para fins de debug).
app.get('/logs', async (req, res) => {
    try {

        const logs: Log[] = await prisma.log.findMany()

        return res.status(200).json(logs)
    } catch (err) {

    }
})

const server = app.listen(3000, () =>
    console.log('App ouvindo na porta 3000'))




