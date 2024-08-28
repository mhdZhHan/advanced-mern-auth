import bcrypt from "bcryptjs"

// models
import { User } from "../models/user.model.js"

// lib
import { generateTokenAndSetCookie } from "../lib/generateTokenAndSetCookie.js"
import { sendVerificationEmail } from "../mailtrap/emails.js"

export const signup = async (req, res) => {
	const { email, password, name } = req.body

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required") // handle in catch
		}

		const userAlreadyExists = await User.findOne({ email })

		if (userAlreadyExists) {
			return res.status(400).json({ message: "User already exists" })
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const verificationToken = Math.floor(
			100000 + Math.random() * 900000
		).toString() // 6 digit verification code

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		})

		await user.save()

		// jwt
		generateTokenAndSetCookie(res, user._id)

		await sendVerificationEmail(user.email, verificationToken)

		res.status(201).json({
			// 200 => something created successfully
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		})
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

export const login = async (req, res) => {}

export const logout = async (req, res) => {}
