import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import { router as usersController } from "./users/usersController"
import { router as artistsControler } from "./artists/artistsController"

async function main() {
    const app = express()
    const port = 4000

    app.use("/photos", express.static("images"))

    app.use(express.json())
    app.use(cors())

    app.use("/users", usersController)
    app.use("/artists", artistsControler)

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })
}

main()
