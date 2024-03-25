import { PoolConnection } from "mysql2/promise"
import { SignUpUserInput } from "./inputs/signUpUserInput"
import { v4 } from "uuid"
import jwt from "jsonwebtoken"

export class UsersRepository {
    constructor(private connection: PoolConnection) {}

    async signUpUser(input: SignUpUserInput) {
        const startDate = new Date()

        const userId = v4()

        const query = `
            INSERT INTO users (id, userName, password, country, userAge, startDate)
            VALUES (?, ?, ?, ?, ?, ?)
        `
        const params = [userId, input.userName, input.password, input.country, input.userAge, startDate]

        await this.connection.execute(query, params)
        return userId
    }

    async generateToken(userId: string) {
        const secretKey: any = process.env.SECRET_KEY
        const token = jwt.sign({ userId: userId }, secretKey)
        return token
    }

    async signInUser(userName: string, password: string) {
        const query = `
            SELECT id FROM users
            WHERE userName = ? AND password = ?
        `
        const params = [userName, password]

        const [rows]: any = await this.connection.execute(query, params)
        if (rows.length === 0) throw new Error("Incorrect credentials")

        const userId = rows[0].id
        return userId
    }

    async getUser(userId: string) {
        const query = `
        SELECT userName, password, country, userAge FROM users
        WHERE id = ?
        `
        const params = [userId]

        const [rows]: any = await this.connection.execute(query, params)

        const user = rows[0]
        return user
    }

    async verifyToken(token: string) {
        const secretKey: any = process.env.SECRET_KEY
        const tokenInfo: any = jwt.verify(token, secretKey)

        return tokenInfo.userId
    }
}
