import { combineResolvers } from 'graphql-resolvers'

import pubsub, { EVENTS } from '../subscription'
import { isAuthenticated, isCommentOwner } from './middleware/authorization'

const toCursorHash = (string: string) => Buffer.from(string).toString('base64')

const fromCursorHash = (string: string) => Buffer.from(string, 'base64').toString('ascii')

export default {
	Query: {
		comments: async (_: any, { cursor, limit = 100 }: any, { MongoDB }: any) => {
			const cursorOptions = cursor
				? {
						createdAt: {
							$lt: fromCursorHash(cursor),
						},
				  }
				: {}
			const comments = await MongoDB.Comment.find(cursorOptions, null, {
				sort: { createdAt: -1 },
				limit: limit + 1,
			})

			const hasNextPage = comments.length > limit
			const edges = hasNextPage ? comments.slice(0, -1) : comments

			return {
				edges,
				pageInfo: {
					hasNextPage,
					endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString()),
				},
			}
		},
		comment: async (_: any, { id }: any, { MongoDB }: any) => {
			return await MongoDB.Comment.findById(id)
		},
	},

	Mutation: {
		createComment: combineResolvers(isAuthenticated, async (_, { text }, { MongoDB, me }) => {
			const comment = await MongoDB.Comment.create({
				text,
				userId: me.id,
			})

			pubsub.publish(EVENTS.MESSAGE.CREATED, {
				commentCreated: { comment },
			})

			return comment
		}),

		deleteComment: combineResolvers(
			isAuthenticated,
			isCommentOwner,
			async (_, { id }, { MongoDB }) => {
				const comment = await MongoDB.Comment.findById(id)

				if (comment) {
					await comment.remove()
					return true
				} else {
					return false
				}
			}
		),
	},

	Comment: {
		user: async (comment: any, _: any, { loaders }: any) => {
			return await loaders.user.load(comment.userId)
		},
	},

	Subscription: {
		commentCreated: {
			subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
		},
	},
}
