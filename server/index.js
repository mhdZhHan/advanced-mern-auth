import path from "node:path"
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import { connectDb } from "./db/connectDb.js"

// routers
import authRoute from "./routes/auth.route.js"

dotenv.config()

const app = express()

// middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json()) // allow parse incoming requests with JSON payload
app.use(cookieParser()) // allow parse incoming cookies

// routes
app.use("/api/auth", authRoute)

const __dirname = path.resolve()
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/dist")))

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
	})
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	connectDb()
	console.log(`server running on http://localhost:${PORT}`)
})
