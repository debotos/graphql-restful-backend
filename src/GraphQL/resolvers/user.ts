import jwt from 'jsonwebtoken'
import { combineResolvers } from 'graphql-resolvers'
import { AuthenticationError, UserInputError } from 'apollo-server'

import { isAdmin, isAuthenticated } from './middleware/authorization'

const expiresTime: string = process.env.JWT_TIMEOUT || '60m'

const createToken = async (user: any, jwtSecret: string, expiresIn: string) => {
	const { id, email, username, role } = user
	return await jwt.sign({ id, email, username, role }, jwtSecret, { expiresIn })
}

export default {
	Query: {
		users: async (_: any, __: any, { MongoDB }: any) => {
			return await MongoDB.User.find()
		},
		user: async (_: any, { id }: any, { MongoDB }: any) => {
			return await MongoDB.User.findById(id)
		},
		me: async (_: any, __: any, { MongoDB, me }: any) => {
			if (!me) return null
			return await MongoDB.User.findById(me.id)
		},
	},

	Mutation: {
		signUp: async (_: any, data: any, { MongoDB, jwtSecret }: any) => {
			const user = await MongoDB.User.create(data)

			return { token: createToken(user, jwtSecret, expiresTime) }
		},

		signIn: async (_: any, { login, password }: any, { MongoDB, jwtSecret }: any) => {
			const user = await MongoDB.User.findByLogin(login)

			// No user found with this login credentials.
			if (!user) throw new UserInputError('Wrong credentials.')

			const isValid = await user.validatePassword(password)

			if (!isValid) throw new AuthenticationError('Invalid password.')

			return { token: createToken(user, jwtSecret, expiresTime) }
		},

		updateUser: combineResolvers(isAuthenticated, async (_, data, { MongoDB, me }) => {
			return await MongoDB.User.findByIdAndUpdate(me.id, data, { new: true })
		}),

		deleteUser: combineResolvers(isAdmin, async (_, { id }, { MongoDB }) => {
			const user = await MongoDB.User.findById(id)

			if (user) {
				await user.remove()
				return true
			} else {
				return false
			}
		}),
	},

	User: {
		comments: async (user: any, _: any, { MongoDB }: any) => {
			return await MongoDB.Comment.find({ userId: user.id })
		},
	},
}
