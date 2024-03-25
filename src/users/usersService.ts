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

    async verifyToken(token: string) {
        const tokenInfo = await this.usersRepository.verifyToken(token)
        return tokenInfo
    }
}
