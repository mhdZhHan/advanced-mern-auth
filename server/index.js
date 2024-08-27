import dotenv from "dotenv"
import express from "express"
import { connectDb } from "./db/connectDb.js"

// routers
import authRoute from "./routes/auth.route.js"

dotenv.config()

const app = express()

app.get("/", (req, res) => {
	res.send("Hello, World!")
})

app.use("/api/auth", authRoute)

app.listen(3000, () => {
	connectDb()
	console.log(`server running on http://localhost:${3000}`)
})
