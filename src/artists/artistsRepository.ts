import { PoolConnection, RowDataPacket } from "mysql2/promise"
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
