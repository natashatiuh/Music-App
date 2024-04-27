export class UserEntity {
    userName?: string
    password?: string
    country?: string
    userAge?: number
    userPhoto?: string

    constructor(userName?: string, password?: string, country?: string, userAge?: number, photo?: string) {
        this.userName = userName
        this.password = password
        this.country = country
        this.userAge = userAge
        this.userPhoto = photo
    }
}
