import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import { router as usersController } from "./users/usersController"

async function main() {
    const app = express()
    const port = 4000

    app.use(express.json())
    app.use(cors())

    app.use("/users", usersController)

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })
}

main()
