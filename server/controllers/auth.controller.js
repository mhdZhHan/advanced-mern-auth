import bcrypt from "bcryptjs"
import crypto from "crypto"

// models
import { User } from "../models/user.model.js"

// lib
import { generateTokenAndSetCookie } from "../lib/generateTokenAndSetCookie.js"
import {
	sendVerificationEmail,
	sendWelcomeEmail,
	sendPasswordRestEmail,
	sendRestSuccessEmail,
} from "../mailtrap/emails.js"

export const signup = async (req, res) => {
	const { email, password, name } = req.body

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required") // handle in catch
		}

		const userAlreadyExists = await User.findOne({ email })

		if (userAlreadyExists) {
			return res
				.status(400)
				.json({ success: false, message: "User already exists" })
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
			// 201 => something created successfully
			success: true,
			message: "User Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		})
	} catch (error) {
		console.log("Error in sign up")
		res.status(400).json({ success: false, message: error.message })
	}
}

export const verifyEmail = async (req, res) => {
	const { code } = req.body

	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		})

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired verification cod",
			})
		}

		user.isVerified = true

		// after done verification delete the verificationToken an expire date
		user.verificationToken = undefined
		user.verificationTokenExpiresAt = undefined

		await user.save()

		await sendWelcomeEmail(user.email, user.name)

		res.status(200).json({
			success: true,
			message: "Email verification successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		})
	} catch (error) {
		console.log("Error in verify email ", error)
		res.status(500).json({ success: false, message: "Server error" })
	}
}

export const login = async (req, res) => {
	const { email, password } = req.body

	try {
		const user = await User.findOne({ email })

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid credentials",
			})
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!isPasswordValid) {
			return res.status(400).json({
				success: false,
				message: "Invalid credentials",
			})
		}

		// jwt
		generateTokenAndSetCookie(res, user._id)

		user.lastLogin = new Date()
		await user.save()

		res.status(200).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		})
	} catch (error) {
		console.log("Error in login")
		res.status(400).json({
			success: false,
			message: error.message,
		})
	}
}

export const logout = async (req, res) => {
	res.clearCookie("token")
	res.status(200).json({ success: true, message: "Logged out successfully" })
}

export const forgotPassword = async (req, res) => {
	const { email } = req.body

	try {
		const user = await User.findOne({ email })

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "User not fount" })
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex")
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour

		user.resetPasswordToken = resetToken
		user.resetPasswordExpiresAt = resetTokenExpiresAt

		await user.save()

		//send email
		await sendPasswordRestEmail(
			user.email,
			`${process.env.CLIENT_URL}/rest-password/${resetToken}`
		)

		res.status(200).json({
			success: true,
			message: "Password rest link sent to your email",
		})
	} catch (error) {
		console.log("Error in forgotPassword")
		res.status(400).json({ success: false, message: error.message })
	}
}

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params
		const { password } = req.body

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		})

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired rest token",
			})
		}

		//update password
		const hashPassword = await bcrypt.hash(password, 10)

		user.password = hashPassword
		user.resetPasswordToken = undefined
		user.resetPasswordExpiresAt = undefined

		await user.save()

		await sendRestSuccessEmail(user.email)

		res.status(200).json({
			success: true,
			message: "Password reset successful",
		})
	} catch (error) {
		console.log("Error in resetPassword")
		res.status(500).json({ success: false, message: error.message })
	}
}

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password")

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			})
		}

		res.status(200).json({
			success: true,
			user: user,
		})
	} catch (error) {
		console.log("Error in checkAuth")
		res.status(500).json({ success: false, message: error.message })
	}
}
