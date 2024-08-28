import { mailtrapClient, sender } from "./mailtrap.config.js"
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js"

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
