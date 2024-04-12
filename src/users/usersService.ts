import { SignUpUserInput } from "./inputs/signUpUserInput"
import { UsersRepository } from "./usersRepository"

export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async signUpUser(input: SignUpUserInput) {
        const userId = await this.usersRepository.signUpUser(input)
        const token = await this.usersRepository.generateToken(userId)
        return token
    }

    async signInUser(userName: string, password: string) {
        const userId = await this.usersRepository.signInUser(userName, password)
        const token = await this.usersRepository.generateToken(userId)
        return token
    }

    async getUser(userId: string) {
        const user = await this.usersRepository.getUser(userId)
        return user
    }

    async changeUserName(userId: string, newName: string) {
        const wasUserNameChanged = await this.usersRepository.changeUserName(userId, newName)
        return wasUserNameChanged
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const wasPasswordChanged = await this.usersRepository.changePassword(userId, oldPassword, newPassword)
        return wasPasswordChanged
    }

    async changeCountry(userId: string, newCountry: string) {
        const wasCountryChanged = await this.usersRepository.changeCountry(userId, newCountry)
        return wasCountryChanged
    }

    async verifyToken(token: string) {
        const userId: string = await this.usersRepository.verifyToken(token)
        return userId
    }
}
