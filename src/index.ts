const express = require('express');
import apiClient from '../axios/axios-config'
const logger = require('./middlewares/logger')
const swaggerUi = require('swagger-ui-express');
import swaggerFile from './docs/swagger-output.json';
const app = express()
import { PrismaClient, Prisma, Filme, Log } from '@prisma/client'
import { MovieDBMovie } from './Interfaces/MovieDBMovie';
import { log1_geral } from './middlewares/log1_geral';
import { log2_erro } from './middlewares/log2_erro';
import { requireAuth } from './middlewares/requireAuth';
import { Args } from '@prisma/client/runtime/library';
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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.post('/login', (req, res) => {
    /*  #swagger.parameters['body'] = {
           in: 'body',
           description: 'Fazer login',
           schema: {
               $password: 'hello',
           }
   } */
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
    /*  #swagger.parameters['body'] = {
    in: 'body',
    description: 'Filme a ser inserido',
    schema: {
        $nomeDoFilme: 'El Camino',
    }
} */
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

        res.status(201).send("Filme inserido")

    } catch (err) {
        console.log(err)
        res.status(500).send("Erro ao inserir o filme")
    }
})


app.get('/filme', [requireAuth, logFilmeMiddleware], async (req, res) => {
    /* #swagger.responses[200] = {
              description: 'Lista de filmes',
              schema: [{
      "id": 1,
      "moviedbId": 559969,
      "titulo": "El Camino: A Breaking Bad Film (El Camino: A Breaking Bad Movie)",
      "sinopse": "Após sua dramática fuga do cativeiro, Jesse precisa se reconciliar com o passado para que consiga criar algum tipo de futuro. Escrito e dirigido pelo criador de Breaking Bad, Vince Gilligan, e estrelado por Aaron Paul.",
      "createdAt": "2025-02-09T21:00:46.376Z",
      "assistido": true,
      "avaliado": "4",
      "recomendado": true,
      "generos": [
        {
          "id": 18,
          "genero": "Drama"
        },
        {
          "id": 53,
          "genero": "Thriller"
        },
        {
          "id": 80,
          "genero": "Crime"
        }
      ]
    }]
      } */

    try {
        const pagina: number = Number(req.query.pagina);
        console.log(req.query.assistidos)
        console.log(req.query.assistidos === 'true')
        let skip: number = 0;
        const take = 10;
        if (Number.isInteger(pagina) && pagina > 0) {
            skip = pagina - 1
            skip = skip * take
            console.log(skip)
        }
        const query: Prisma.FilmeFindManyArgs = {
            take: take,
            include: {
                generos: true
            },
            skip: skip,
        };

        if (req.query.assistidos != undefined) {
            query.where = {
                assistido: req.query.assistidos === 'true'
            }
        }
        const filmes = await prisma.filme.findMany(query)
        res.set('max-pages', Math.ceil(await prisma.filme.count() / take))
        res.status(200).json(filmes)
    } catch (err) {
        console.log(err)
        res.status(500).send("falha")
    }
})

//    - `GET /filme/:id` → Retorna detalhes de um filme específico.
app.get('/filme/:id', [requireAuth, logFilmeMiddleware], async (req, res) => {
    //  #swagger.parameters['id'] = { description: 'ID do filme.' }
    /* #swagger.responses[200] = {
            description: 'Filme retornado',
            schema: {
    "id": 1,
    "moviedbId": 559969,
    "titulo": "El Camino: A Breaking Bad Film (El Camino: A Breaking Bad Movie)",
    "sinopse": "Após sua dramática fuga do cativeiro, Jesse precisa se reconciliar com o passado para que consiga criar algum tipo de futuro. Escrito e dirigido pelo criador de Breaking Bad, Vince Gilligan, e estrelado por Aaron Paul.",
    "createdAt": "2025-02-09T21:00:46.376Z",
    "assistido": true,
    "avaliado": "4",
    "recomendado": true,
    "generos": [
      {
        "id": 18,
        "genero": "Drama"
      },
      {
        "id": 53,
        "genero": "Thriller"
      },
      {
        "id": 80,
        "genero": "Crime"
      }
    ]
  }
    } */
    try {

        let filme: Filme = await prisma.filme.findUniqueOrThrow({
            where: {
                id: Number(req.params.id)
            }
        })

        res.status(200).json(filme)
    } catch (err: any) {
        if (err.code == 'P2025') {
            res.status(404).send('Não encontrado')
        } else {
            res.status(500).send('Algo deu errado')
        }

    }
})

//    - `PUT /filme/:id/estado` → Move o filme para um novo estado (ex: assistido, avaliado, recomendado).
app.put('/filme/:id/assistir', [requireAuth, logFilmeMiddleware], async (req, res) => {
    //  #swagger.parameters['id'] = { description: 'ID do filme.' }
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
        res.status(200).send('assistido')
    } catch (err) {
        res.status(404).send('filme nao encontrado')
    }
})

app.post('/filme/:id/recomendar', [requireAuth, logFilmeMiddleware], async (req, res) => {
    //  #swagger.parameters['id'] = { description: 'ID do filme.' }
    try {
        let filme: Filme = await prisma.filme.findUniqueOrThrow({
            where: {
                id: Number(req.params.id)
            }
        })
        if (filme.avaliado == null) {
            res.status(422).send('O filme precisa ser avaliado para ser recomendado')
        }
        await prisma.filme.update(
            {
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    recomendado: true
                }
            }
        )
        res.status(200).send('Filme recomendado')

    } catch (err) {
        res.status(404).send('Filme não encontrado')
    }
})

app.put('/filme/:id/desassistir', [requireAuth, logFilmeMiddleware], async (req, res) => {
    //  #swagger.parameters['id'] = { description: 'ID do filme.' }
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
    //  #swagger.parameters['id'] = { description: 'ID do filme.' }
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
            res.status(422).send('O filme precisa ser assitido antes de ser avaliado')
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
        res.status(200).send('Filme avaliado')

    } catch (err) {
        console.log(err)
    }
})

//    - `GET /filme/:id/historico` → Retorna o histórico completo de um filme.
app.get('/filme/:id/historico', [requireAuth, logFilmeMiddleware], async (req, res) => {
    //  #swagger.parameters['id'] = { description: 'ID do filme.' }
    /* #swagger.responses[200] = {
               description: 'Log do filme especifico',
               schema: [
           {
               "id": 6,
               "metodo": "POST",
               "url": "/filme/1/recomendar",
               "statusResposta": 200,
               "createdAt": "2025-02-09T21:00:55.571Z",
               "filmeId": 1,
               "body": "{}",
               "usuarioId": 1
           }]
       } */




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
    /* #swagger.responses[200] = {
           description: 'Log do filme especifico',
           schema: [
       {
           "id": 6,
           "metodo": "POST",
           "url": "/filme/1/recomendar",
           "statusResposta": 200,
           "createdAt": "2025-02-09T21:00:55.571Z",
           "filmeId": 1,
           "body": "{}",
           "usuarioId": 1
       }]
   } */
    try {

        const logs: Log[] = await prisma.log.findMany()

        res.status(200).json(logs)
    } catch (err) {

    }
})

const server = app.listen(3000, () =>
    console.log('App ouvindo na porta 3000'))




