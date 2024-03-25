import express from "express"
import { PoolConnection } from "mysql2/promise"
import { pool } from "../common/dbPool"
import { auth } from "../common/middlewares/auth"
import { validation } from "../common/middlewares/validation"
import { signUpUserSchema } from "./schemas/signUpUserSchema"
import { UsersRepository } from "./usersRepository"
import { UsersService } from "./usersService"
import { SignUpUserInput } from "./inputs/signUpUserInput"

export const router = express.Router()

async function runInTransaction<T>(func: (connection: PoolConnection) => T): Promise<T> {
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
        const output = func(connection)
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
