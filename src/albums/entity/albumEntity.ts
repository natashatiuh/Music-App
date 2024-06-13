export class AlbumEntity {
    id?: string
    name?: string
    artistId?: string
    photo?: string
    songsAmount?: number
    publishedDate?: Date

    constructor(
        id?: string,
        name?: string,
        artistId?: string,
        photo?: string,
        songsAmount?: number,
        publishedDate?: Date
    ) {
        this.id = id
        this.name = name
        this.artistId = artistId
        this.photo = photo
        this.songsAmount = songsAmount
        this.publishedDate = publishedDate
    }
}
