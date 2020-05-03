import { gql } from 'apollo-server-express'

import userSchema from './user'
import commentSchema from './comment'
import messageSchema from './message'

const linkSchema = gql`
	scalar Date

	type Query {
		_: Boolean
	}

	type Mutation {
		_: Boolean
	}

	type Subscription {
		_: Boolean
	}
`

export default [linkSchema, userSchema, commentSchema, messageSchema]
