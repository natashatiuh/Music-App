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

    async getArtist(userId: string) {
        const artist = await this.artistsRepository.getArtist(userId)
        return artist
    }

    async verifyToken(token: string) {
        const userId = await this.artistsRepository.verifyToken(token)
        return userId
    }
}
