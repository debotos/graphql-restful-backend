// To handle 'Unhandled promise rejections' error that caused by async/await inside route handler
require('express-async-errors')
import * as dotenv from 'dotenv'
// set ENV variables & Credentials
dotenv.config()

import app, { httpServer } from './app'
import { sequelize } from './DB_Models/PostgreSQL'
import { REST_API_PREFIX } from './RESTful/routes'

const PORT: Number = app.get('port')
const HOST: string = process.env.HOST_URL || 'http://localhost'
/* Change it to false in time of production or to make the data stable */
const eraseDatabaseOnSync: boolean = false /* Just for postgres DB (Not MongoDB) */

/* seed the database on every application startup if true */
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
	httpServer.listen(PORT, () => {
		console.log(` ✅  Connected to Postgres Database`)
		console.log(` 🚀  RESTful Server is up on ${HOST}:${PORT}${REST_API_PREFIX}`)
		console.log(` 🚀  GraphQL Server is on on ${HOST}:${PORT}/graphql`)
	})
})
