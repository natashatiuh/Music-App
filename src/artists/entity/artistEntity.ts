export class ArtistEntity {
    userName?: string
    password?: string
    country?: string
    artistAge?: number
    artistPhoto?: string
    followersAmount?: number

    constructor(
        userName?: string,
        password?: string,
        country?: string,
        artistAge?: number,
        artistPhoto?: string,
        followersAmount?: number
    ) {
        this.userName = userName
        this.password = password
        this.country = country
        this.artistAge = artistAge
        this.artistPhoto = artistPhoto
        this.followersAmount = followersAmount
    }
}
