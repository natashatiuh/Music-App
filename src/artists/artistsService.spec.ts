import dotenv from "dotenv"
dotenv.config()
import { pool } from "../common/dbPool"
import { ArtistsRepository } from "./artistsRepository"
import { ArtistsService } from "./artistsService"
import { SignUpArtistInput } from "./inputs/signUpArtistInput"
import { PoolConnection } from "mysql2/promise"
dotenv.config()

jest.setTimeout(60 * 1000)

describe("Artists service", () => {
    let connection: PoolConnection

    beforeAll(async () => {
        connection = await pool.getConnection()
    })

    beforeEach(async () => {
        await connection.query("TRUNCATE artists")
    })

    async function createArtistsService() {
        const artistsRepository = new ArtistsRepository(connection)
        const artistsService = new ArtistsService(artistsRepository)
        return artistsService
    }

    test("new artist should be created", async () => {
        const artistData = new SignUpArtistInput("Onuka", "12121212", "Ukraine", 34)
        const artistsService = await createArtistsService()

        const token = await artistsService.signUpArtist(artistData)
        const userId = await artistsService.verifyToken(token)

        const newArtist = await artistsService.getArtist(userId)

        expect(newArtist.userName).toEqual("Onuka")
        expect(newArtist.password).toEqual("12121212")
        expect(newArtist.country).toEqual("Ukraine")
        expect(newArtist.artistAge).toEqual(34)
    })

    test("user should be existed", async () => {
        const artistData = new SignUpArtistInput("Skillet", "12121212", "USA", 45)
        const artistsService = await createArtistsService()

        const token = await artistsService.signUpArtist(artistData)
        const userId = await artistsService.verifyToken(token)

        const newArtist = await artistsService.getArtist(userId)

        const existingArtistToken = await artistsService.signInArtist("Skillet", "12121212")
        const existingArtistUserId = await artistsService.verifyToken(existingArtistToken)

        const existingArtist = await artistsService.getArtist(existingArtistUserId)

        expect(existingArtist.userName).toEqual(newArtist.userName)
        expect(existingArtist.password).toEqual(newArtist.password)
        expect(existingArtist.country).toEqual(newArtist.country)
        expect(existingArtist.artistAge).toEqual(newArtist.artistAge)
    })

    test("artist's name should be changed", async () => {
        const artistData = new SignUpArtistInput("Dorofeeva", "11111111", "Ukraine", 34)
        const artistsService = await createArtistsService()

        const token = await artistsService.signUpArtist(artistData)
        const userId = await artistsService.verifyToken(token)

        const artist = await artistsService.getArtist(userId)

        await artistsService.changeArtistName("Beyonce", userId)

        const changedArtist = await artistsService.getArtist(userId)

        expect(artist.userName).toEqual("Dorofeeva")
        expect(changedArtist.userName).toEqual("Beyonce")
    })

    test("artist's password should be changed", async () => {
        const artistData = new SignUpArtistInput("Parfeniuk", "12121212", "Ukraine", 21)
        const artistsService = await createArtistsService()

        const token = await artistsService.signUpArtist(artistData)
        const userId = await artistsService.verifyToken(token)

        const artist = await artistsService.getArtist(userId)

        await artistsService.changeArtistPassword("11111111", "12121212", userId)

        const chnagedArtist = await artistsService.getArtist(userId)

        expect(artist.password).toEqual("12121212")
        expect(chnagedArtist.password).toEqual("11111111")
    })

    test("artist's password shouldn't be changed, currentPassword isn't correct", async () => {
        const artistData = new SignUpArtistInput("Pivovarov", "12121212", "Ukraine", 31)
        const artistsService = await createArtistsService()

        const token = await artistsService.signUpArtist(artistData)
        const userId = await artistsService.verifyToken(token)

        await artistsService.changeArtistPassword("11111111", "22222222", userId)

        const artist = await artistsService.getArtist(userId)

        expect(artist.password).toEqual("12121212")
    })

    test("artist's country should be changed", async () => {
        const artistData = new SignUpArtistInput("O'Torvald", "12121212", "UK", 29)
        const artistsService = await createArtistsService()

        const token = await artistsService.signUpArtist(artistData)
        const userId = await artistsService.verifyToken(token)

        const artist = await artistsService.getArtist(userId)

        await artistsService.changeArtistCountry("Ukraine", userId)

        const changedArtist = await artistsService.getArtist(userId)

        expect(artist.country).toEqual("UK")
        expect(changedArtist.country).toEqual("Ukraine")
    })

    test("artist should be deleted", async () => {
        const artistData = new SignUpArtistInput("Iryna Bilyk", "12121212", "Ukraine", 52)
        const artistsService = await createArtistsService()

        const token = await artistsService.signUpArtist(artistData)
        const userId = await artistsService.verifyToken(token)

        const artist = await artistsService.getArtist(userId)

        await artistsService.deleteArtist(userId)

        const deletedArtist = await artistsService.getArtist(userId)

        expect(artist.userName).toEqual("Iryna Bilyk")
        expect(deletedArtist.userName).toEqual(undefined)
    })

    test("artist photo should be added", async () => {
        const artistData = new SignUpArtistInput("Monatik", "12121212", "Moldova", 41)
        const artistsService = await createArtistsService()

        const token = await artistsService.signUpArtist(artistData)
        const usersId = await artistsService.verifyToken(token)

        await artistsService.addArtistPhoto(usersId, "photo1.jpg")

        const artist = await artistsService.getArtist(usersId)

        expect(artist.artistPhoto).toEqual("photo1.jpg")
    })
})
