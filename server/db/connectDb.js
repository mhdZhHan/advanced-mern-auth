import mongoose from "mongoose"

export const connectDb = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URL)
		console.log(`MongoDb Connected ${conn.connection.host}`)
	} catch (error) {
		console.log("Error connection to MongoDb ", error.message)
		process.exit(1)
	}
}
