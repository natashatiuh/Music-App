import express from "express"
import multer from "multer"
import path from "path"
import { v4 } from "uuid"
import { auth } from "../common/middlewares/auth"
import { validation } from "../common/middlewares/validation"
import { signUpArtistSchema } from "./schemas/signUpArtistSchema"
import { PoolConnection } from "mysql2/promise"
import { pool } from "../common/dbPool"
import { ArtistsRepository } from "./artistsRepository"
import { ArtistsService } from "./artistsService"
import { SignUpArtistInput } from "./inputs/signUpArtistInput"
import { signInArtistSchema } from "./schemas/signInArtistSchema"
import { changeArtistName } from "./schemas/changeArtistNameSchema"
import { MyRequest } from "../users/requestDefinition"
import { changeArtistPassword } from "./schemas/changeArtistPasswordSchema"
import { changeArtistCountrySchema } from "./schemas/changeArtistCountrySchema"
import { UsersRepository } from "../users/usersRepository"
import { UsersService } from "../users/usersService"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/artists")
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

router.patch("/artist-name", auth(), validation(changeArtistName), async (req, res) => {
    try {
        await runInTransaction(async (connection) => {
            const artistsRepository = new ArtistsRepository(connection)
            const artistsService = new ArtistsService(artistsRepository)

            const { newName } = req.body
            const wasArtistNameChanged = await artistsService.changeArtistName(newName, (req as MyRequest).userId)

            if (!wasArtistNameChanged) {
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

router.patch("/artist-password", auth(), validation(changeArtistPassword), async (req, res) => {
    try {
        await runInTransaction(async (connection) => {
            const artistsRepository = new ArtistsRepository(connection)
            const artistsService = new ArtistsService(artistsRepository)

            const { oldPassword, newPassword } = req.body
            const wasPasswordChanged = await artistsService.changeArtistPassword(
                newPassword,
                oldPassword,
                (req as MyRequest).userId
            )

            if (!wasPasswordChanged) {
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

router.patch("/artist-country", auth(), validation(changeArtistCountrySchema), async (req, res) => {
    try {
        await runInTransaction(async (connection) => {
            const artistsRepository = new ArtistsRepository(connection)
            const artistService = new ArtistsService(artistsRepository)

            const { newCountry } = req.body
            const wasCountryChanged = await artistService.changeArtistCountry(newCountry, (req as MyRequest).userId)

            if (!wasCountryChanged) {
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

router.delete("/", auth(), async (req, res) => {
    try {
        await runInTransaction(async (connection) => {
            const artistsRepository = new ArtistsRepository(connection)
            const artistsService = new ArtistsService(artistsRepository)

            const wasArtistDeleted = await artistsService.deleteArtist((req as MyRequest).userId)
            if (!wasArtistDeleted) {
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

router.patch("/photo", auth(), upload.single("photo"), async (req, res) => {
    try {
        await runInTransaction(async (connection) => {
            const artistsRepository = new ArtistsRepository(connection)
            const artistsService = new ArtistsService(artistsRepository)

            const photo = req.file?.filename

            const wasPhotoAdded = await artistsService.addArtistPhoto((req as MyRequest).userId, photo)

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

router.patch("/delete-photo", auth(), async (req, res) => {
    try {
        await runInTransaction(async (connection) => {
            const artistsRepository = new ArtistsRepository(connection)
            const artistsService = new ArtistsService(artistsRepository)

            const wasPhotoDeleted = await artistsService.deleteArtistPhoto((req as MyRequest).userId)

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
