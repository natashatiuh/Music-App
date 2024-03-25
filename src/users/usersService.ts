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
        const userName = await this.usersRepository.getUser(userId)
        return userName
    }

    async verifyToken(token: string) {
        const userId = await this.usersRepository.verifyToken(token)
        return userId
    }
}
