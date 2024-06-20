import express from "express"
import multer from "multer"
import path from "path"
import { PoolConnection } from "mysql2/promise"
import { pool } from "../common/dbPool"
import { addAlbumSchema } from "./schemas/addAlbumSchema"
import { auth } from "../common/middlewares/auth"
import { validation } from "../common/middlewares/validation"
import { AlbumsRepository } from "./albumsRepository"
import { AlbumsService } from "./albumsService"
import { MyRequest } from "../users/requestDefinition"
import { editAlbumNameSchema } from "./schemas/editAlbumNameSchema"
import { v4 } from "uuid"
import { addAlbumPhotoSchema } from "./schemas/addAlbumPhotoSchema"
import { deleteAlbumPhotoSchema } from "./schemas/deleteAlbumPhotoSchema"
import { deleteAlbumSchema } from "./schemas/deleteAlbumSchema"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/albums")
    },
    filename: (req, file, cb) => {
        cb(null, v4() + path.extname(file.originalname))
    },
})

const upload = multer({
    storage: storage,
})

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

router.patch("/photo", auth(), upload.single("photo"), validation(addAlbumPhotoSchema), async (req, res) => {
    try {
        runInTransaction(async (connection) => {
            const albumsRepository = new AlbumsRepository(connection)
            const albumsService = new AlbumsService(albumsRepository)

            const photo = req.file?.filename

            const { albumId } = req.body
            const wasPhotoAdded = await albumsService.addAlbumPhoto(albumId, (req as MyRequest).userId, photo)

            if (!wasPhotoAdded) {
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

router.patch("/delete-photo", auth(), validation(deleteAlbumPhotoSchema), async (req, res) => {
    try {
        runInTransaction(async (connection) => {
            const albumsRepository = new AlbumsRepository(connection)
            const albumsService = new AlbumsService(albumsRepository)

            const { albumId } = req.body
            const wasPhotoDeleted = await albumsService.deleteAlbumPhoto(albumId, (req as MyRequest).userId)

            if (!wasPhotoDeleted) {
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

router.patch("delete-album", auth(), validation(deleteAlbumSchema), async (req, res) => {
    try {
        runInTransaction(async (connection) => {
            const albumsRepository = new AlbumsRepository(connection)
            const albumsService = new AlbumsService(albumsRepository)

            const { albumId } = req.body

            const wasAlbumDeleted = await albumsService.deleteAlbum(albumId, (req as MyRequest).userId)

            if (!wasAlbumDeleted) {
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

router.get("/artist-albums", auth(), async (req, res) => {
    try {
        const artistAlbums = runInTransaction(async (connection) => {
            const albumsRepository = new AlbumsRepository(connection)
            const albumsService = new AlbumsService(albumsRepository)

            const artistAlbums = await albumsService.getArtistAlbums((req as MyRequest).userId)

            return artistAlbums
        })
        res.json({ artistAlbums })
    } catch (error) {
        console.log(error)
        res.json({ success: false })
    }
})

router.get("/all-albums", async (req, res) => {
    try {
        const albums = runInTransaction(async (connection) => {
            const albumsRepository = new AlbumsRepository(connection)
            const albumsService = new AlbumsService(albumsRepository)

            const albums = await albumsService.getAllAlbums()

            return albums
        })
        res.json({ albums })
    } catch (error) {
        console.log(error)
        res.json({ success: false })
    }
})
