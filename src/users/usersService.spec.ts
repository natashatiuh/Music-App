import dotenv from "dotenv"
dotenv.config()
import { pool } from "../common/dbPool"
import { SignUpUserInput } from "./inputs/signUpUserInput"
import { UsersRepository } from "./usersRepository"
import { UsersService } from "./usersService"
import { PoolConnection } from "mysql2/promise"
import { SignUpArtistInput } from "../artists/inputs/signUpArtistInput"
import { ArtistsRepository } from "../artists/artistsRepository"
import { ArtistsService } from "../artists/artistsService"

jest.setTimeout(60 * 1000)

describe("Users Service", () => {
    let connection: PoolConnection

    beforeAll(async () => {
        connection = await pool.getConnection()
    })

    beforeEach(async () => {
        await connection.query("TRUNCATE users")
        await connection.query("TRUNCATE artists")
    })

    async function createUsersService() {
        const usersRepository = new UsersRepository(connection)
        const usersService = new UsersService(usersRepository)
        return usersService
    }

    test("new user should be created", async () => {
        const usersService = await createUsersService()
        const userData = new SignUpUserInput("Marta", "11111111", "Moldova", 28)

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        const newUser = await usersService.getUser(userId)

        expect(newUser.userName).toEqual("Marta")
        expect(newUser.password).toEqual("11111111")
        expect(newUser.country).toEqual("Moldova")
        expect(newUser.userAge).toEqual(28)
    })

    test("user should be able to sign in", async () => {
        const usersService = await createUsersService()
        const userData = new SignUpUserInput("Milana", "12121212", "Ukraine", 23)

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        const signInToken = await usersService.signInUser("Milana", "12121212")
        const signInUserId = await usersService.verifyToken(signInToken)

        expect(userId).toEqual(signInUserId)
    })

    test("username should be changed", async () => {
        const usersService = await createUsersService()
        const userData = new SignUpUserInput("Olena", "12121212", "Spain", 25)

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        await usersService.changeUserName(userId, "Alena")

        const newUserNameUser = await usersService.getUser(userId)

        expect(newUserNameUser.userName).toEqual("Alena")
    })

    test("username shouldn't be changed", async () => {
        const usersService = await createUsersService()
        const userData = new SignUpUserInput("Inna", "12121212", "Italy", 19)

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        await usersService.changeUserName(userId, "I")

        const changedUser = await usersService.getUser(userId)

        expect(changedUser.userName).toEqual("Inna")
    })

    test("password should be changed", async () => {
        const usersService = await createUsersService()
        const userData = new SignUpUserInput("Monika", "11111111", "USA", 34)

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        await usersService.changePassword(userId, "11111111", "22222222")

        const newPasswordUser = await usersService.getUser(userId)

        expect(newPasswordUser.password).toEqual("22222222")
    })

    test("password shouldn't be chnaged, currentPassword is not correct", async () => {
        const usersService = await createUsersService()
        const userData = new SignUpUserInput("Albina", "12121212", "Kyiv", 26)

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        await usersService.changePassword(userId, "11111111", "22222222")

        const changedUser = await usersService.getUser(userId)

        expect(changedUser.password).toEqual("12121212")
    })

    test("country should be changed", async () => {
        const usersService = await createUsersService()
        const userData = new SignUpUserInput("Stepan", "12345678", "Moldova", 39)

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        await usersService.changeCountry(userId, "Romania")

        const newCountryUser = await usersService.getUser(userId)

        expect(newCountryUser.country).toEqual("Romania")
    })

    test("user should be returned", async () => {
        const usersService = await createUsersService()
        const userData = new SignUpUserInput("Ivan", "12121212", "Romania", 22)

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        const user = await usersService.getUser(userId)

        expect(user.userName).toEqual("Ivan")
        expect(user.password).toEqual("12121212")
        expect(user.country).toEqual("Romania")
        expect(user.userAge).toEqual(22)
        expect(user.userPhoto).toEqual(null)
    })

    test("user should be deleted", async () => {
        const usersService = await createUsersService()
        const userData = new SignUpUserInput("Vasyl", "12121212", "Greece", 29)

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        const user = await usersService.getUser(userId)

        await usersService.deleteUser(userId)
        const deletedUser = await usersService.getUser(userId)

        expect(user.userName).toEqual("Vasyl")
        expect(deletedUser.userName).toEqual(undefined)
    })

    test("user photo should be added", async () => {
        const usersService = await createUsersService()
        const userData = new SignUpUserInput("Mark", "12121212", "Italy", 56)

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        await usersService.addUserPhoto(userId, "nejdn2ue9euiwje.jpg")

        const user = await usersService.getUser(userId)

        expect(user.userPhoto).toEqual("nejdn2ue9euiwje.jpg")
    })

    test("user photo should be changed", async () => {
        const usersService = await createUsersService()
        const userData = new SignUpUserInput("Ariel", "12121212", "USA", 19)

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        await usersService.addUserPhoto(userId, "photo1.jpg")

        const user = await usersService.getUser(userId)

        await usersService.addUserPhoto(userId, "photo2.jpg")

        const changedUser = await usersService.getUser(userId)

        expect(user.userPhoto).toEqual("photo1.jpg")
        expect(changedUser.userPhoto).toEqual("photo2.jpg")
    })

    test("user photo should be deleted", async () => {
        const usersService = await createUsersService()
        const userData = new SignUpUserInput("Monro", "12121212", "UK", 29)

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        await usersService.addUserPhoto(userId, "photo1.jpg")
        const user = await usersService.getUser(userId)

        await usersService.deleteUserPhoto(userId)
        const changedUser = await usersService.getUser(userId)

        expect(user.userPhoto).toEqual("photo1.jpg")
        expect(changedUser.userPhoto).toEqual(null)
    })

    test("user should be followed to artist", async () => {
        const usersService = await createUsersService()

        const userDataOne = new SignUpUserInput("Jane", "12121212", "Moldova", 23)
        const userDataTwo = new SignUpUserInput("Monila", "12121212", "Romania", 25)

        const tokenOne = await usersService.signUpUser(userDataOne)
        const tokenTwo = await usersService.signUpUser(userDataTwo)

        const userIdOne = await usersService.verifyToken(tokenOne)
        const userIdTwo = await usersService.verifyToken(tokenTwo)

        const artistsRepository = new ArtistsRepository(connection)
        const artistsService = new ArtistsService(artistsRepository)
        const artistData = new SignUpArtistInput("Britney", "12121212", "USA", 41)

        const artistToken = await artistsService.signUpArtist(artistData)
        const artistId = await artistsService.verifyToken(artistToken)

        await usersService.followArtist(userIdOne, artistId)
        await usersService.followArtist(userIdTwo, artistId)

        const artist = await artistsService.getArtist(artistId)

        expect(artist.followersAmount).toEqual(2)
    })
})
