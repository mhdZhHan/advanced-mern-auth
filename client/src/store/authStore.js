import { create } from "zustand"
import axios from "axios"

const API_URL =
	import.meta.env.MODE === "development"
		? "http://localhost:5000/api/auth"
		: "/api/auth"

axios.defaults.withCredentials = true
export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null })

		try {
			const response = await axios.post(`${API_URL}/signup`, {
				email,
				password,
				name,
			})
			set({
				user: response.data.user,
				isAuthenticated: true,
			})
		} catch (error) {
			set({
				error: error.response.data.message || "Error signing up",
			})
			throw error
		} finally {
			set({ isLoading: false })
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null })

		try {
			const response = await axios.post(`${API_URL}/login`, {
				email,
				password,
			})
			set({
				user: response.data.user,
				isAuthenticated: true,
				error: null,
			})
		} catch (error) {
			set({
				error: error.response.data.message || "Error logging in",
			})
			throw error
		} finally {
			set({ isLoading: false })
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null })
		try {
			await axios.post(`${API_URL}/logout`)
			set({
				user: null,
				isAuthenticated: false,
				error: null,
				isLoading: false,
			})
		} catch (error) {
			set({ error: "Error logging out", isLoading: false })
			throw error
		}
	},

	verifyEmail: async (verificationCode) => {
		set({ isLoading: true, error: null })

		try {
			const response = await axios.post(`${API_URL}/verify-email`, {
				code: verificationCode,
			})

			set({
				user: response.data.user,
				isAuthenticated: true,
			})

			return response.data
		} catch (error) {
			set({
				error: error.response.data.message || "Error verifying email",
			})
			throw error
		} finally {
			set({ isLoading: false })
		}
	},

	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null })
		try {
			const response = await axios.get(`${API_URL}/check-auth`)

			set({
				user: response.data.user,
				isAuthenticated: true,
			})
		} catch (error) {
			set({ error: null, isAuthenticated: false })
		} finally {
			set({ isCheckingAuth: false })
		}
	},

	forgotPassword: async (email) => {
		set({ isLoading: true, error: null, message: null })
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, {
				email,
			})

			set({ message: response.data.message })
		} catch (error) {
			set({
				error:
					error.data.response.message ||
					"Error sending reset password email",
			})
			throw error
		} finally {
			set({ isLoading: false })
		}
	},

	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null })

		try {
			const response = await axios.post(
				`${API_URL}/reset-password/${token}`,
				{
					password,
				}
			)

			set({ message: response.data.message })
		} catch (error) {
			set({
				error:
					error.data.response.message || "Error resetting password",
			})
			throw error
		} finally {
			set({ isLoading: false })
		}
	},
}))
