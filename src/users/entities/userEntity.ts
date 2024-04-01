export class UserEntity {
    userName?: string
    password?: string
    country?: string
    userAge?: number

    constructor(userName?: string, password?: string, country?: string, userAge?: number) {
        this.userName = userName
        this.password = password
        this.country = country
        this.userAge = userAge
    }
}
