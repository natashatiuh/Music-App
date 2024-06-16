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

    async editAlbumName(newName: string, albumId: string, artistId: string) {
        const wasAlbumNameChanged = await this.albumsRepository.editAlbumName(newName, albumId, artistId)
        return wasAlbumNameChanged
    }

    async addAlbumPhoto(albumId: string, artistId: string, photo?: string) {
        const wasPhotoAdded = await this.albumsRepository.addAlbumPhoto(albumId, artistId, photo)
        return wasPhotoAdded
    }
}
