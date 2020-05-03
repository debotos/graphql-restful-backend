import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		comments(cursor: String, limit: Int): CommentConnection!
		comment(id: ID!): Comment!
	}
	extend type Mutation {
		createComment(text: String!): Comment!
		deleteComment(id: ID!): Boolean!
	}
	type CommentConnection {
		edges: [Comment!]!
		pageInfo: CommentPageInfo!
	}
	type CommentPageInfo {
		hasNextPage: Boolean!
		endCursor: String!
	}
	type Comment {
		id: ID!
		text: String!
		createdAt: Date!
		user: User!
	}
	extend type Subscription {
		commentCreated: CommentCreated!
	}
	type CommentCreated {
		comment: Comment!
	}
`
