import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise"
import { v4 } from "uuid"
import { AlbumEntity } from "./entity/albumEntity"

export class AlbumsRepository {
    constructor(private connection: PoolConnection) {}

    async addAlbum(name: string, artistId: string) {
        const albumId = v4()

        const publishedDate = new Date()

        const query = `
            INSERT INTO albums (id, name, artistId, songsAmount, publishedDate)
            VALUES (?, ?, ?, ?, ?)
        `
        const params = [albumId, name, artistId, 0, publishedDate]

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

    async editAlbumName(newName: string, albumId: string, artistId: string) {
        const query = `
            UPDATE albums
            SET name = ?
            WHERE id = ? AND artistId = ?
        `
        const params = [newName, albumId, artistId]

        const [rows] = await this.connection.execute(query, params)
        const resultSetHeader = rows as ResultSetHeader

        if (resultSetHeader.affectedRows === 0) return false
        return true
    }

    async addAlbumPhoto(albumId: string, artistId: string, photo?: string) {
        const query = `
            UPDATE albums
            SET photo = ?
            WHERE id = ? AND artistId = ?
        `
        const params = [photo, albumId, artistId]

        const [rows] = await this.connection.execute(query, params)

        const resultSetHeader = rows as ResultSetHeader

        if (resultSetHeader.affectedRows === 0) return false
        return true
    }

    async deleteAlbumPhoto(albumId: string, artistId: string) {
        const query = `
            UPDATE albums
            SET photo = NULL
            WHERE id = ? AND artistId = ?
        `
        const params = [albumId, artistId]

        const [rows] = await this.connection.execute(query, params)

        const resultSetHeader = rows as ResultSetHeader

        if (resultSetHeader.affectedRows === 0) return false
        return true
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
