/*
  This file works as an abstraction layer for protecting GraphQL operations, 
  with solutions called combined resolvers or resolver middleware.
  Using the package graphql-resolvers

  Alternatively, (this becomes repetitive and error prone for this we use upper solution)
  you can do following in every resolvers- 
  import { ForbiddenError } from 'apollo-server'
  -> pull out the 'me' var from 'context' then 
  if (!me) {
			throw new ForbiddenError(`You're not authenticated as a user.`)
  }
*/

import { AuthenticationError, ForbiddenError } from 'apollo-server'
import { combineResolvers, skip } from 'graphql-resolvers'

/* The isAuthenticated() resolver function acts as middleware */
export const isAuthenticated = (_: any, __: any, { me }: any) =>
	me ? skip : new AuthenticationError(`You're not authenticated as a user.`)

export const isAdmin = combineResolvers(isAuthenticated, (_, __, { me: { role } }) =>
	role === 'ADMIN' ? skip : new ForbiddenError('Not authorized as admin.')
)

export const isCommentOwner = async (_: any, { id }: any, { MongoDB, me }: any) => {
	const comment = await MongoDB.Comment.findById(id)

	if (comment.userId != me.id) {
		throw new ForbiddenError('Not authenticated as owner.')
	}

	return skip
}
