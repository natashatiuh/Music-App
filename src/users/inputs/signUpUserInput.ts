export class SignUpUserInput {
    public userName: string
    public password: string
    public country: string
    public userAge: number

    constructor(userName: string, password: string, country: string, userAge: number) {
        this.userName = userName
        this.password = password
        this.country = country
        this.userAge = userAge
    }
}
