import { MailtrapClient } from "mailtrap"
import dotenv from "dotenv"

dotenv.config()

// const TOKEN = process.env.MAILTRAP_TOKEN
// const ENDPOINT = process.env.MAILTRAP_ENDPOINT

const TOKEN = "7eb7e3695994b9acf4483205a6dbed0d"
const ENDPOINT = "https://send.api.mailtrap.io/"

console.log(TOKEN, ENDPOINT)

export const mailtrapClient = new MailtrapClient({
	endpoint: ENDPOINT,
	token: TOKEN,
})

export const sender = {
	email: "mailtrap@demomailtrap.com",
	name: "Mohammed",
}

// const recipients = [
// 	{
// 		email: "dev.mohammedsh@gmail.com",
// 	},
// ]

// client
// 	.send({
// 		from: sender,
// 		to: recipients,
// 		subject: "You are awesome!",
// 		html: "Congrats for sending test email with Mailtrap!",
// 		category: "Integration Test",
// 	})
// 	.then(console.log, console.error)
