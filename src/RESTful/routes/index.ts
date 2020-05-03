import express = require('express')

import { ContactRoutes } from './ContactRoutes'

export const REST_API_PREFIX: string = '/api'

const setupRESTfulRoutes = (app: express.Application): any => {
	app.use(REST_API_PREFIX + `/contact`, ContactRoutes())
	/* Put other routes below as a statement not ',' separated */
}

export default setupRESTfulRoutes
