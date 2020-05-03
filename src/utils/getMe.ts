import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-express'

declare var process: { env: { [key: string]: string } }

export default function (req: any) {
	const token = req.headers['x-token']

	if (token) {
		try {
			return jwt.verify(token, process.env.JWT_SECRET)
		} catch (error) {
			const { message } = error
			if (message) throw new AuthenticationError(`JWT token${message.replace('jwt', '')}`)
			throw new AuthenticationError('JWT token verification failed')
		}
	}

	return null
}
