import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

async function main() {
    const app = express()
    const port = 4000

    app.use(express.json())
    app.use(cors())

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })
}

main()
