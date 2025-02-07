import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    await prisma.genero.createMany({
        data: [
            {
                "id": 28,
                "genero": "Ação"
            },
            {
                "id": 12,
                "genero": "Aventura"
            },
            {
                "id": 16,
                "genero": "Animação"
            },
            {
                "id": 35,
                "genero": "Comédia"
            },
            {
                "id": 80,
                "genero": "Crime"
            },
            {
                "id": 99,
                "genero": "Documentário"
            },
            {
                "id": 18,
                "genero": "Drama"
            },
            {
                "id": 10751,
                "genero": "Família"
            },
            {
                "id": 14,
                "genero": "Fantasia"
            },
            {
                "id": 36,
                "genero": "História"
            },
            {
                "id": 27,
                "genero": "Terror"
            },
            {
                "id": 10402,
                "genero": "Música"
            },
            {
                "id": 9648,
                "genero": "Mistério"
            },
            {
                "id": 10749,
                "genero": "Romance"
            },
            {
                "id": 878,
                "genero": "Ficção científica"
            },
            {
                "id": 10770,
                "genero": "Cinema TV"
            },
            {
                "id": 53,
                "genero": "Thriller"
            },
            {
                "id": 10752,
                "genero": "Guerra"
            },
            {
                "id": 37,
                "genero": "Faroeste"
            }
        ]
    })

}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })





