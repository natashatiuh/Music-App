import { PoolConnection, RowDataPacket } from "mysql2/promise"
import { v4 } from "uuid"
import { AlbumEntity } from "./entity/albumEntity"

export class AlbumsRepository {
    constructor(private connection: PoolConnection) {}

    async addAlbum(name: string, artistId: string) {
        const albumId = v4()

        const publishedDate = new Date()

        const query = `
            INSERT INTO albums (id, name, artistId, publishedDate)
            VALUES (?, ?, ?, ?)
        `
        const params = [albumId, name, artistId, publishedDate]

        await this.connection.execute(query, params)

        return albumId
    }

    async getAlbum(albumId: string) {
        const query = `
            SELECT id, name, artistId, photo, songsAmount, publishedDate 
            FROM albums
            WHERE id = ?
        `
        const params = [albumId]

        const [rows] = await this.connection.execute<IGetUserQueryResult[]>(query, params)
        const albumInfo = rows[0]

        const album = new AlbumEntity(
            albumInfo?.id,
            albumInfo?.name,
            albumInfo?.artistId,
            albumInfo?.photo,
            albumInfo?.songsAmount,
            albumInfo?.publishedDate
        )

        return album
    }
}

interface IGetUserQueryResult extends RowDataPacket {
    id: string
    name: string
    artistId: string
    photo: string
    songsAmount: number
    publishedDate: Date
}
