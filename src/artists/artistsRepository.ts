import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise"
import { SignUpArtistInput } from "./inputs/signUpArtistInput"
import { v4 } from "uuid"
import jwt, { Secret } from "jsonwebtoken"
import { ArtistEntity } from "./entity/artistEntity"

export class ArtistsRepository {
    constructor(private connection: PoolConnection) {}

    async signUpArtist(input: SignUpArtistInput) {
        const startDate = new Date()

        const userId = v4()

        const query = `
            INSERT INTO artists (
            id, userName, password, country, artistAge, 
            albumsAmount, songsAmount, followersAmount, startDate) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
        const { userName, password, country, artistAge } = input
        const params = [userId, userName, password, country, artistAge, 0, 0, 0, startDate]

        await this.connection.execute(query, params)
        return userId
    }

    async signInArtist(userName: string, password: string) {
        const query = `
            SELECT id FROM artists
            WHERE userName = ? AND password = ?
        `
        const params = [userName, password]

        const [rows] = await this.connection.execute<IGetUserQueryResult[]>(query, params)

        if (rows.length === 0) throw new Error("Incorrect credentials!")

        const userId: string = rows[0]?.id
        return userId
    }

    async changeArtistName(newName: string, userId: string) {
        const query = `
            UPDATE artists
            SET userName = ?
            WHERE id = ?
        `
        const params = [newName, userId]

        const [rows] = await this.connection.execute(query, params)

        const resultSetHeader = rows as ResultSetHeader

        if (resultSetHeader.affectedRows === 0) return false
        return true
    }

    async changeArtistPassword(newPassword: string, oldPassword: string, userId: string) {
        const query = `
            UPDATE artists
            SET password = ?
            WHERE password = ? AND id = ?
        `
        const params = [newPassword, oldPassword, userId]

        const [rows] = await this.connection.execute(query, params)

        const resultSetHeader = rows as ResultSetHeader

        if (resultSetHeader.affectedRows === 0) return false
        return true
    }

    async getArtist(userId: string) {
        const query = `
            SELECT userName, password, country, artistAge
            FROM artists
            WHERE id = ?
        `
        const params = [userId]

        const [rows] = await this.connection.execute<IGetUserQueryResult[]>(query, params)
        const artistInfo = rows[0]

        const artist = new ArtistEntity(
            artistInfo?.userName,
            artistInfo?.password,
            artistInfo?.country,
            artistInfo?.artistAge
        )

        return artist
    }

    async generateToken(userId: string) {
        const secretKey: Secret | undefined = process.env.SECRET_KEY as Secret
        const token = jwt.sign({ userId: userId }, secretKey)
        return token
    }

    async verifyToken(token: string) {
        const secretKey: Secret | undefined = process.env.SECRET_KEY as Secret
        const tokenInfo = jwt.verify(token, secretKey) as jwt.JwtPayload

        return tokenInfo.userId
    }
}

interface IGetUserQueryResult extends RowDataPacket {
    userName: string
    password: string
    country: string
    artistAge: number
}
