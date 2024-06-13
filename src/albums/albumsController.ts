import express from "express"
import { PoolConnection } from "mysql2/promise"
import { pool } from "../common/dbPool"
import { addAlbumSchema } from "./schemas/addAlbumSchema"
import { auth } from "../common/middlewares/auth"
import { validation } from "../common/middlewares/validation"
import { AlbumsRepository } from "./albumsRepository"
import { AlbumsService } from "./albumsService"
import { MyRequest } from "../users/requestDefinition"
import { editAlbumNameSchema } from "./schemas/editAlbumNameSchema"

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

router.post("/", auth(), validation(addAlbumSchema), async (req, res) => {
    try {
        const albumId = await runInTransaction(async (connection) => {
            const albumsRepository = new AlbumsRepository(connection)
            const albumsService = new AlbumsService(albumsRepository)

            const { name } = req.body
            const albumId = await albumsService.addAlbum(name, (req as MyRequest).userId)

            return albumId
        })

        res.json({ albumId })
    } catch (error) {
        console.log(error)
        res.json({ success: false })
    }
})

router.patch("/", auth(), validation(editAlbumNameSchema), async (req, res) => {
    try {
        await runInTransaction(async (connection) => {
            const albumsRepository = new AlbumsRepository(connection)
            const albumsService = new AlbumsService(albumsRepository)

            const { newName, albumId } = req.body
            const wasAlbumNameChanged = await albumsService.editAlbumName(newName, albumId, (req as MyRequest).userId)

            if (!wasAlbumNameChanged) {
                res.json({ success: false })
            } else {
                res.json({ success: true })
            }
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false })
    }
})
