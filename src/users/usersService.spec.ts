import dotenv from "dotenv"
dotenv.config()
import { pool } from "../common/dbPool"
import { SignUpUserInput } from "./inputs/signUpUserInput"
import { UsersRepository } from "./usersRepository"
import { UsersService } from "./usersService"

jest.setTimeout(60 * 1000)

describe("Users Service", () => {
    beforeEach(async () => {
        const connection = await pool.getConnection()
        await connection.query("TRUNCATE users")
    })

    async function createUsersService() {
        const connection = await pool.getConnection()
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
})
