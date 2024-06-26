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
        await connection.query("TRUNCATE artists")
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

    test("the album's name should be changed", async () => {
        const albumsService = await createAlbumsService()
        const artistsService = await createArtistService()

        const artistData = new SignUpArtistInput("Naomi", "12121212", "Italy", 19)

        const token = await artistsService.signUpArtist(artistData)
        const artistId = await artistsService.verifyToken(token)

        const albumId = await albumsService.addAlbum("Super Model", artistId)
        const album = await albumsService.getAlbum(albumId)

        await albumsService.editAlbumName("Top Model", albumId, artistId)
        const editedAlbum = await albumsService.getAlbum(albumId)

        expect(album.name).toEqual("Super Model")
        expect(editedAlbum.name).toEqual("Top Model")
    })

    test("photo should be added", async () => {
        const albumsService = await createAlbumsService()
        const artistsService = await createArtistService()

        const artistData = new SignUpArtistInput("Monetochka", "12121212", "Latvia", 29)

        const token = await artistsService.signUpArtist(artistData)
        const artistId = await artistsService.verifyToken(token)

        const albumId = await albumsService.addAlbum("Selfharm", artistId)

        await albumsService.addAlbumPhoto(albumId, artistId, "album-photo.jpg")

        const album = await albumsService.getAlbum(albumId)

        expect(album.photo).toEqual("album-photo.jpg")
    })

    test("photo should be changed", async () => {
        const albumsService = await createAlbumsService()
        const artistsService = await createArtistService()

        const artistData = new SignUpArtistInput("Rihanna", "12121212", "USA", 34)

        const token = await artistsService.signUpArtist(artistData)
        const artistId = await artistsService.verifyToken(token)

        const albumId = await albumsService.addAlbum("Umbrella", artistId)

        await albumsService.addAlbumPhoto(albumId, artistId, "umbrella.jpg")
        const album = await albumsService.getAlbum(albumId)

        await albumsService.addAlbumPhoto(albumId, artistId, "new-umbrella.jpg")
        const updatedAlbum = await albumsService.getAlbum(albumId)

        expect(album.photo).toEqual("umbrella.jpg")
        expect(updatedAlbum.photo).toEqual("new-umbrella.jpg")
    })

    test("photo should be deleted", async () => {
        const albumsService = await createAlbumsService()
        const artistsService = await createArtistService()

        const artistData = new SignUpArtistInput("Tom Cruze", "12121212", "Spain", 48)

        const token = await artistsService.signUpArtist(artistData)
        const artistId = await artistsService.verifyToken(token)

        const albumId = await albumsService.addAlbum("Great day", artistId)

        await albumsService.addAlbumPhoto(albumId, artistId, "photo.jpg")
        const album = await albumsService.getAlbum(albumId)

        await albumsService.deleteAlbumPhoto(albumId, artistId)
        const updatedAlbum = await albumsService.getAlbum(albumId)

        expect(album.photo).toEqual("photo.jpg")
        expect(updatedAlbum.photo).toEqual(null)
    })

    test("album should be deleted", async () => {
        const albumsService = await createAlbumsService()
        const artistsService = await createArtistService()

        const artistData = new SignUpArtistInput("Sabrina", "12121212", "USA", 32)

        const token = await artistsService.signUpArtist(artistData)
        const artistId = await artistsService.verifyToken(token)

        const albumId = await albumsService.addAlbum("Espresso", artistId)
        const album = await albumsService.getAlbum(albumId)

        await albumsService.deleteAlbum(albumId, artistId)
        const deletedAlbum = await albumsService.getAlbum(albumId)

        expect(album.name).toEqual("Espresso")
        expect(deletedAlbum.name).toEqual(undefined)
    })

    test("should receive all artists albums", async () => {
        const albumsService = await createAlbumsService()
        const artistsService = await createArtistService()

        const artistData = new SignUpArtistInput("Meghan", "12121212", "Germany", 31)

        const token = await artistsService.signUpArtist(artistData)
        const artistId = await artistsService.verifyToken(token)

        await albumsService.addAlbum("Album One", artistId)
        await albumsService.addAlbum("AlbumTwo", artistId)
        await albumsService.addAlbum("AlbumThree", artistId)

        const artistAlbums = await albumsService.getArtistAlbums(artistId)

        expect(artistAlbums.length).toEqual(3)
    })

    test("should receive all albums", async () => {
        const albumsService = await createAlbumsService()
        const artistsService = await createArtistService()

        const artistDataOne = new SignUpArtistInput("Shakira", "12121212", "Brazil", 47)
        const artistDataTwo = new SignUpArtistInput("Ariana", "12121212", "USA", 29)

        const tokenOne = await artistsService.signUpArtist(artistDataOne)
        const tokenTwo = await artistsService.signUpArtist(artistDataTwo)

        const artistIdOne = await artistsService.verifyToken(tokenOne)
        const artistIdTwo = await artistsService.verifyToken(tokenTwo)

        await albumsService.addAlbum("Woka", artistIdOne)
        await albumsService.addAlbum("Latina", artistIdOne)
        await albumsService.addAlbum("Next", artistIdTwo)
        await albumsService.addAlbum("Bang", artistIdTwo)

        const albums = await albumsService.getAllAlbums()

        expect(albums.length).toEqual(4)
    })
})
