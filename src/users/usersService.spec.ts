import dotenv from "dotenv"
dotenv.config()
import { pool } from "../common/dbPool"
import { SignUpUserInput } from "./inputs/signUpUserInput"
import { UsersRepository } from "./usersRepository"
import { UsersService } from "./usersService"
import { PoolConnection } from "mysql2/promise"

jest.setTimeout(60 * 1000)

describe("Users Service", () => {
    let connection: PoolConnection

    beforeAll(async () => {
        connection = await pool.getConnection()
    })

    beforeEach(async () => {
        await connection.query("TRUNCATE users")
    })

    async function createUsersService() {
        const usersRepository = new UsersRepository(connection)
        const usersService = new UsersService(usersRepository)
        return usersService
    }

    test("new user should be created", async () => {
        const userData = new SignUpUserInput("Marta", "11111111", "Moldova", 28)
        const usersService = await createUsersService()

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        const newUser = await usersService.getUser(userId)

        expect(newUser.userName).toEqual("Marta")
        expect(newUser.password).toEqual("11111111")
        expect(newUser.country).toEqual("Moldova")
        expect(newUser.userAge).toEqual(28)
    })

    test("user should be able to sign in", async () => {
        const userData = new SignUpUserInput("Milana", "12121212", "Ukraine", 23)
        const usersService = await createUsersService()

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        const signInToken = await usersService.signInUser("Milana", "12121212")
        const signInUserId = await usersService.verifyToken(signInToken)

        expect(userId).toEqual(signInUserId)
    })

    test("username should be changed", async () => {
        const userData = new SignUpUserInput("Olena", "12121212", "Spain", 25)
        const usersService = await createUsersService()

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        await usersService.changeUserName(userId, "Alena")

        const newUserNameUser = await usersService.getUser(userId)

        expect(newUserNameUser.userName).toEqual("Alena")
    })

    test("password should be changed", async () => {
        const userData = new SignUpUserInput("Monika", "11111111", "USA", 34)
        const usersService = await createUsersService()

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        await usersService.changePassword(userId, "11111111", "22222222")

        const newPasswordUser = await usersService.getUser(userId)

        expect(newPasswordUser.password).toEqual("22222222")
    })

    test("country should be changed", async () => {
        const userData = new SignUpUserInput("Stepan", "12345678", "Moldova", 39)
        const usersService = await createUsersService()

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        await usersService.changeCountry(userId, "Romania")

        const newCountryUser = await usersService.getUser(userId)

        expect(newCountryUser.country).toEqual("Romania")
    })

    test("user should be deleted", async () => {
        const userData = new SignUpUserInput("Vasyl", "12121212", "Greece", 29)
        const usersService = await createUsersService()

        const token = await usersService.signUpUser(userData)
        const userId = await usersService.verifyToken(token)

        const user = await usersService.getUser(userId)

        await usersService.deleteUser(userId)
        const deletedUser = await usersService.getUser(userId)

        expect(user.userName).toEqual("Vasyl")
        expect(deletedUser.userName).toEqual(undefined)
    })
})
