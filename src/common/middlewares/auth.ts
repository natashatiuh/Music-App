import { UsersRepository } from "../../users/usersRepository"
import { UsersService } from "../../users/usersService"
import { pool } from "../dbPool"

export function auth() {
    return async (req: any, res: any, next: any) => {
        try {
            const token = req.headers.authorization
            if (!token) throw new Error("Unauthorized!")

            const connection = await pool.getConnection()
            const usersRepository = new UsersRepository(connection)
            const usersService = new UsersService(usersRepository)

            req.userId = await usersService.verifyToken(token)

            next()
        } catch (error) {
            console.log(error)
            res.send("Unauthorized!")
        }
    }
}
