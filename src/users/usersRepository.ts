import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise"
import { SignUpUserInput } from "./inputs/signUpUserInput"
import { v4 } from "uuid"
import jwt, { Secret } from "jsonwebtoken"
import { UserEntity } from "./entities/userEntity"

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
        const secretKey: Secret | undefined = process.env.SECRET_KEY as Secret
        const token = jwt.sign({ userId: userId }, secretKey)
        return token
    }

    async signInUser(userName: string, password: string): Promise<string> {
        const query = `
            SELECT id FROM users
            WHERE userName = ? AND password = ?
        `
        const params = [userName, password]

        const [rows] = await this.connection.execute<IGetUserQueryResult[]>(query, params)
        console.log([rows])
        if (rows.length === 0) throw new Error("Incorrect credentials")

        const userId: string = rows[0]?.id
        return userId
    }

    async getUser(userId: string) {
        const query = `
            SELECT userName, password, country, userAge FROM users
            WHERE id = ?
        `
        const params = [userId]

        const [rows] = await this.connection.execute<IGetUserQueryResult[]>(query, params)
        const userInfo = rows[0]

        const user = new UserEntity(userInfo?.userName, userInfo?.password, userInfo?.country, userInfo?.userAge)

        return user
    }

    async changeUserName(userId: string, newName: string) {
        const query = `
            UPDATE users
            SET userName = ?
            WHERE ID = ?
        `
        const params = [newName, userId]

        const [rows] = await this.connection.execute(query, params)

        const resultSetHeader = rows as ResultSetHeader

        if (resultSetHeader.affectedRows === 0) return false
        return true
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const query = `
            UPDATE users
            SET password = ?
            WHERE id = ? AND password = ?
        `
        const params = [newPassword, userId, oldPassword]

        const [rows] = await this.connection.execute(query, params)

        const resultSetHeader = rows as ResultSetHeader

        if (resultSetHeader.affectedRows === 0) return false
        return true
    }

    async changeCountry(userId: string, newCountry: string) {
        const query = `
            UPDATE users
            SET country = ?
            WHERE id = ?
        `
        const params = [newCountry, userId]

        const [rows] = await this.connection.execute(query, params)

        const resultSetHeader = rows as ResultSetHeader

        if (resultSetHeader.affectedRows === 0) return false
        return true
    }

    async deleteUser(userId: string) {
        const query = `
            DELETE FROM users
            WHERE id = ?
        `
        const params = [userId]

        const [rows] = await this.connection.execute(query, params)

        const resultSetHeader = rows as ResultSetHeader

        if (resultSetHeader.affectedRows === 0) return false
        return true
    }

    async verifyToken(token: string) {
        const secretKey: Secret = process.env.SECRET_KEY as Secret
        const tokenInfo = jwt.verify(token, secretKey) as jwt.JwtPayload

        return tokenInfo.userId
    }
}

interface IGetUserQueryResult extends RowDataPacket {
    userName: string
    password: string
    country: string
    userAge: number
}
