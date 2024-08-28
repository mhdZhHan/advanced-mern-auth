import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"

import { connectDb } from "./db/connectDb.js"

// routers
import authRoute from "./routes/auth.route.js"

dotenv.config()

const app = express()

// middlewares
app.use(express.json()) // allow parse incoming requests with JSON payload
app.use(cookieParser()) // allow parse incoming cookies

app.get("/", (req, res) => {
	res.send("Hello, World!")
})

app.use("/api/auth", authRoute)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	connectDb()
	console.log(`server running on http://localhost:${PORT}`)
})
