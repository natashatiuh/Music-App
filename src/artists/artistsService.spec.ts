import dotenv from "dotenv"
dotenv.config()
import { pool } from "../common/dbPool"
import { ArtistsRepository } from "./artistsRepository"
import { ArtistsService } from "./artistsService"
import { SignUpArtistInput } from "./inputs/signUpArtistInput"
dotenv.config()

jest.setTimeout(60 * 1000)

describe("Artists service", () => {
    beforeEach(async () => {
        const connection = await pool.getConnection()
        await connection.query("TRUNCATE artists")
    })

    async function createArtistsService() {
        const connection = await pool.getConnection()
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
})
