import express from "express"
import { validation } from "../common/middlewares/validation"
import { signUpArtistSchema } from "./schemas/signUpArtistSchema"
import { PoolConnection } from "mysql2/promise"
import { pool } from "../common/dbPool"
import { ArtistsRepository } from "./artistsRepository"
import { ArtistsService } from "./artistsService"
import { SignUpArtistInput } from "./inputs/signUpArtistInput"
import { signInArtistSchema } from "./schemas/signInArtistSchema"

export const router = express.Router()

async function runInTransaction<T>(func: (connection: PoolConnection) => T): Promise<T> {
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
        const output = await func(connection)
        await connection.commit()
        return output
    } catch (error) {
        await connection.rollback()
        throw error
    }
}

router.post("/", validation(signUpArtistSchema), async (req, res) => {
    try {
        const token = await runInTransaction(async (connection) => {
            const artistsRepository = new ArtistsRepository(connection)
            const artistsService = new ArtistsService(artistsRepository)

            const { userName, password, country, artistAge } = req.body
            const artistData = new SignUpArtistInput(userName, password, country, artistAge)
            const token = await artistsService.signUpArtist(artistData)

            return token
        })
        res.json({ token })
    } catch (error) {
        console.log(error)
        res.json({ success: false })
    }
})

router.get("/", validation(signInArtistSchema), async (req, res) => {
    try {
        const token = await runInTransaction(async (connection) => {
            const artistsRepository = new ArtistsRepository(connection)
            const artistsService = new ArtistsService(artistsRepository)

            const { userName, password } = req.body
            const token = await artistsService.signInArtist(userName, password)

            return token
        })
        res.json({ token })
    } catch (error) {
        console.log(error)
        res.json({ success: false })
    }
})
