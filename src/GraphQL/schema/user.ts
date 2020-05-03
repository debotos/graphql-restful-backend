import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		users: [User!]
		user(id: ID!): User
		me: User
	}
	extend type Mutation {
		signUp(
			firstName: String!
			lastName: String!
			username: String!
			email: String!
			password: String!
			gender: String!
			role: String!
		): Token!
		signIn(login: String!, password: String!): Token!
		updateUser(firstName: String!, lastName: String!, username: String!, gender: String!): User!
		deleteUser(id: ID!): Boolean!
	}
	type Token {
		token: String!
	}
	type User {
		id: ID!
		firstName: String!
		lastName: String!
		fullName: String!
		username: String!
		email: String!
		gender: String!
		role: String
		comments: [Comment!]
	}
`
