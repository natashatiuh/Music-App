import { ArtistsRepository } from "./artistsRepository"
import { SignUpArtistInput } from "./inputs/signUpArtistInput"

export class ArtistsService {
    constructor(private artistsRepository: ArtistsRepository) {}

    async signUpArtist(input: SignUpArtistInput) {
        const userId = await this.artistsRepository.signUpArtist(input)
        const token = await this.artistsRepository.generateToken(userId)
        return token
    }

    async signInArtist(userName: string, password: string) {
        const userId = await this.artistsRepository.signInArtist(userName, password)
        const token = await this.artistsRepository.generateToken(userId)
        return token
    }

    async changeArtistName(newName: string, userId: string) {
        const wasArtistNameChanged = await this.artistsRepository.changeArtistName(newName, userId)
        return wasArtistNameChanged
    }

    async changeArtistPassword(newPassword: string, oldPassword: string, userId: string) {
        const wasPasswordChanged = await this.artistsRepository.changeArtistPassword(newPassword, oldPassword, userId)
        return wasPasswordChanged
    }

    async changeArtistCountry(newCountry: string, userId: string) {
        const wasCountryChanged = await this.artistsRepository.changeArtistCountry(newCountry, userId)
        return wasCountryChanged
    }

    async deleteArtist(userId: string) {
        const wasArtistDeleted = await this.artistsRepository.deleteArtist(userId)
        return wasArtistDeleted
    }

    async getArtist(userId: string) {
        const artist = await this.artistsRepository.getArtist(userId)
        return artist
    }

    async addArtistPhoto(userId: string, photo?: string) {
        const wasPhotoAdded = await this.artistsRepository.addArtistPhoto(userId, photo)
        return wasPhotoAdded
    }

    async verifyToken(token: string) {
        const userId = await this.artistsRepository.verifyToken(token)
        return userId
    }
}
