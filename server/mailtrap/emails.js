import { mailtrapClient, sender } from "./mailtrap.config.js"
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplate.js"

export const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }]
	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace(
				"{verificationCode}",
				verificationToken
			),
			category: "Email Verification",
		})

		console.log("Email send successfully")
	} catch (error) {
		console.log(`Error sending email: ${error}`)
		throw new Error(`Error sending email: ${error}`)
	}
}

export const sendWelcomeEmail = async (email, name) => {
	const recipient = [{ email }]

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			template_uuid: "8e2b7fa7-9584-4467-8ad4-a7d2ee9cc796",
			template_variables: {
				company_info_name: "MERN AUTH DEMO",
				name: name,
			},
		})

		console.log("Welcome emil send successfully ", response)
	} catch (error) {
		console.log(`Error sending welcome email: ${error}`)
		throw new Error(`Error sending welcome email: ${error}`)
	}
}

export const sendPasswordRestEmail = async (email, resetURL) => {
	const recipient = [{ email }]

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
				"{resetURL}",
				resetURL
			),
			category: "Password reset",
		})

		console.log("Password reset emil send successfully ", response)
	} catch (error) {
		console.log(`Error sending Password reset email: ${error}`)
		throw new Error(`Error sending Password reset email: ${error}`)
	}
}

export const sendRestSuccessEmail = async (email) => {
	const recipient = [{ email }]

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password reset successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password reset",
		})

		console.log("Password reset successful ", response)
	} catch (error) {
		console.log(`Error sending Password reset success email: ${error}`)
		throw new Error(`Error sending Password reset success email: ${error}`)
	}
}
