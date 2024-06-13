import { AlbumsRepository } from "./albumsRepository"

export class AlbumsService {
    constructor(private albumsRepository: AlbumsRepository) {}

    async addAlbum(name: string, artistId: string) {
        const albumId = await this.albumsRepository.addAlbum(name, artistId)
        return albumId
    }

    async getAlbum(albumId: string) {
        const album = await this.albumsRepository.getAlbum(albumId)
        return album
    }
}