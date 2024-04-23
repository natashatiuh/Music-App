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

    test("artist's name should be chnaged", async () => {
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
})
