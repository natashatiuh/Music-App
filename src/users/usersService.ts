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
        if (newName.length <= 1) return false
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

    async deleteUser(userId: string) {
        const wasUserDeleted = await this.usersRepository.deleteUser(userId)
        return wasUserDeleted
    }

    async addUserPhoto(userId: string, photo?: string) {
        const wasPhotoAdded = await this.usersRepository.addUserPhoto(userId, photo)
        return wasPhotoAdded
    }

    async deleteUserPhoto(userId: string) {
        const wasUserPhotoDeleted = await this.usersRepository.deleteUserPhoto(userId)
        return wasUserPhotoDeleted
    }

    async verifyToken(token: string) {
        const userId: string = await this.usersRepository.verifyToken(token)
        return userId
    }
}
