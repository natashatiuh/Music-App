export class SignUpArtistInput {
    public userName: string
    public password: string
    public country: string
    public artistAge: number

    constructor(userName: string, password: string, country: string, artistAge: number) {
        this.userName = userName
        this.password = password
        this.country = country
        this.artistAge = artistAge
    }
}
