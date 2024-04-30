export class ArtistEntity {
    userName?: string
    password?: string
    country?: string
    artistAge?: number
    artistPhoto?: string

    constructor(userName?: string, password?: string, country?: string, artistAge?: number, artistPhoto?: string) {
        this.userName = userName
        this.password = password
        this.country = country
        this.artistAge = artistAge
        this.artistPhoto = artistPhoto
    }
}
