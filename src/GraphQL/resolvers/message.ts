import Sequelize from 'sequelize'
import { combineResolvers } from 'graphql-resolvers'

import pubsub, { EVENTS } from '../subscription'

/* 
	The client shouldn’t care about the format or the actual value of the cursor, 
	so we’ll ask the cursor with a hash function that uses a base64 encoding 
*/
const toCursorHash = (string: string) => {
	return Buffer.from(string).toString('base64')
}
const fromCursorHash = (string: string) => {
	return Buffer.from(string, 'base64').toString('ascii')
}

export default {
	Query: {
		messages: async (_: any, { cursor, offset = 0, limit = 100 }: any, { PostgreSQL }: any) => {
			/* 
				The first page only retrieves the most recent messages in the list, 
				so you can use the creation date of the last message as a cursor for the next page of messages.
			*/

			const messages = await PostgreSQL.Message.findAll({
				order: [
					['createdAt', 'DESC'],
				] /* First, the list should be ordered by createdAt date, otherwise the cursor won’t help */,
				offset,
				limit: limit + 1 /* Added 1 to calculate hasNextPage: Boolean! value */,
				where: cursor /* Second, the ternary operator for the cursor makes sure the cursor isn’t needed for the first page request */
					? {
							createdAt: {
								[Sequelize.Op.lt]: fromCursorHash(cursor),
							},
					  }
					: null,
			})

			const hasNextPage = messages.length > limit
			const edges = hasNextPage ? messages.slice(0, -1) : messages

			return {
				edges,
				pageInfo: {
					/* The client application doesn’t need the details for the cursor of the last message,
						as it have hasNextPage & endCursor now.
						if hasNextPage === true then make another request using endCursor.
					*/
					hasNextPage,
					/* The GraphQL client receives a hashed endCursor field */
					endCursor: hasNextPage
						? toCursorHash(
								edges[edges.length - 1].createdAt.toISOString()
						  ) /* toISOString() is a moment.js function */
						: 'Not available. You are end of the page!',
				},
			}
		},
		message: async (_: any, { id }: any, { PostgreSQL }: any) => {
			return await PostgreSQL.Message.findByPk(id)
		},
	},

	Mutation: {
		createMessage: combineResolvers(async (_: any, { text }: any, { PostgreSQL }: any) => {
			const message = await PostgreSQL.Message.create({ text })

			pubsub.publish(EVENTS.MESSAGE.CREATED, {
				messageCreated: { message },
			})

			return message
		}),

		deleteMessage: combineResolvers(async (_: any, { id }: any, { PostgreSQL }: any) => {
			return await PostgreSQL.Message.destroy({ where: { id } })
		}),
	},

	Subscription: {
		messageCreated: {
			subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
		},
	},
}
