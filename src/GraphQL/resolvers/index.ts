import { GraphQLDateTime } from 'graphql-iso-date'

import userResolvers from './user'
import commentResolvers from './comment'
import messageResolvers from './message'

const customScalarResolver = {
	Date: GraphQLDateTime,
}

export default [customScalarResolver, userResolvers, commentResolvers, messageResolvers]
