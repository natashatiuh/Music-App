import mysql from "mysql2/promise"

export let pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "music_app",
    password: process.env.DATABASE_PASSWORD,
})
