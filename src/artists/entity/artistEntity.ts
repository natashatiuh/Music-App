export class ArtistEntity {
    userName?: string
    password?: string
    country?: string
    artistAge?: number

    constructor(userName?: string, password?: string, country?: string, artistAge?: number) {
        this.userName = userName
        this.password = password
        this.country = country
        this.artistAge = artistAge
    }
}
