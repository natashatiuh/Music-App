import express from "express"
import { PoolConnection } from "mysql2/promise"
import { pool } from "../common/dbPool"
import { auth } from "../common/middlewares/auth"
import { validation } from "../common/middlewares/validation"
import { signUpUserSchema } from "./schemas/signUpUserSchema"
import { UsersRepository } from "./usersRepository"
import { UsersService } from "./usersService"
import { SignUpUserInput } from "./inputs/signUpUserInput"
import { signInUserSchema } from "./schemas/signInUserSchema"
import { MyRequest } from "./requestDefinition"
import { changeUserNameSchema } from "./schemas/changeUserNameSchema"
import { changePasswordSchema } from "./schemas/changePasswordSchema"
import { changeCountrySchema } from "./schemas/changeCountrySchema"

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

router.post("/", validation(signUpUserSchema), async (req, res) => {
    try {
        const token = await runInTransaction(async (connection) => {
            const usersRepository = new UsersRepository(connection)
            const usersService = new UsersService(usersRepository)

            const { userName, password, country, userAge } = req.body
            const userData = new SignUpUserInput(userName, password, country, userAge)

            const token = await usersService.signUpUser(userData)
            return token
        })

        res.json({ token })
    } catch (error) {
        console.log(error)
        res.json({ success: false })
    }
})

router.get("/sign-in", validation(signInUserSchema), async (req, res) => {
    try {
        const token = await runInTransaction(async (connection) => {
            const usersRepository = new UsersRepository(connection)
            const usersService = new UsersService(usersRepository)

            const { userName, password } = req.body
            const token = await usersService.signInUser(userName, password)
            return token
        })

        res.json({ token })
    } catch (error) {
        console.log(error)
        res.json({ success: false })
    }
})

router.get("/", auth(), async (req, res) => {
    try {
        const user = await runInTransaction(async (connection) => {
            const usersRepository = new UsersRepository(connection)
            const usersService = new UsersService(usersRepository)

            const user = await usersService.getUser((req as MyRequest).userId)
            return user
        })

        res.json({ user })
    } catch (error) {
        console.log(error)
        res.json({ success: false })
    }
})

router.patch("/user-name", auth(), validation(changeUserNameSchema), async (req, res) => {
    try {
        await runInTransaction(async (connection) => {
            const usersRepository = new UsersRepository(connection)
            const usersService = new UsersService(usersRepository)

            const { newName } = req.body
            const wasUserNameChanged = await usersService.changeUserName((req as MyRequest).userId, newName)
            if (!wasUserNameChanged) {
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

router.patch("/password", auth(), validation(changePasswordSchema), async (req, res) => {
    try {
        await runInTransaction(async (connection) => {
            const usersRepository = new UsersRepository(connection)
            const usersService = new UsersService(usersRepository)

            const { oldPassword, newPassword } = req.body
            const wasPasswordChanged = await usersService.changePassword(
                (req as MyRequest).userId,
                oldPassword,
                newPassword
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

router.patch("/country", auth(), validation(changeCountrySchema), async (req, res) => {
    try {
        await runInTransaction(async (connection) => {
            const usersRepository = new UsersRepository(connection)
            const usersService = new UsersService(usersRepository)

            const { newCountry } = req.body
            const wasCountryChanged = await usersService.changeCountry((req as MyRequest).userId, newCountry)

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
