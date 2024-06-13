import dotenv from "dotenv"
dotenv.config()
import { PoolConnection } from "mysql2/promise"
import { pool } from "../common/dbPool"
import { AlbumsRepository } from "./albumsRepository"
import { AlbumsService } from "./albumsService"
import { ArtistsRepository } from "../artists/artistsRepository"
import { ArtistsService } from "../artists/artistsService"
import { SignUpArtistInput } from "../artists/inputs/signUpArtistInput"

jest.setTimeout(60 * 1000)

describe("Albums service", () => {
    let connection: PoolConnection

    beforeAll(async () => {
        connection = await pool.getConnection()
    })

    beforeEach(async () => {
        await connection.query("TRUNCATE albums")
    })

    async function createAlbumsService() {
        const albumsRepository = new AlbumsRepository(connection)
        const albumsService = new AlbumsService(albumsRepository)
        return albumsService
    }

    async function createArtistService() {
        const artistsRepository = new ArtistsRepository(connection)
        const artistsService = new ArtistsService(artistsRepository)
        return artistsService
    }

    test("the new album should be added", async () => {
        const albumsService = await createAlbumsService()
        const artistsService = await createArtistService()

        const artistData = new SignUpArtistInput("Nicki", "12121212", "USA", 37)

        const token = await artistsService.signUpArtist(artistData)
        const artistId = await artistsService.verifyToken(token)

        const albumId = await albumsService.addAlbum("Big bass", artistId)

        const album = await albumsService.getAlbum(albumId)

        expect(album.name).toEqual("Big bass")
        expect(album.artistId).toEqual(artistId)
    })
})
