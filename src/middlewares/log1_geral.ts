
import { Prisma, PrismaClient } from "@prisma/client";

export async function log1_geral(reqResPair) {
    const prisma = new PrismaClient()

    const log: Prisma.LogCreateInput = {
        metodo: reqResPair.req.method,
        url: reqResPair.req.url,
        statusResposta: reqResPair.res.statusCode,
        body: JSON.stringify(reqResPair.req.body),
        usuarioId: reqResPair.req.session.userId,
        filme: {
            connect: {
                id: Number(reqResPair.req.params.id)
            }
        }
    }
    try {

        await prisma.log.create({ data: log })
    } catch (err) {
        delete log.filme
        log.statusResposta = reqResPair.res.statusCode
        await prisma.log.create({ data: log })
    }


}