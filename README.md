# care-pine-home-health

```
touch .env
```

Fill it with -

```
# .env

PROJECT_NAME=care-pine-home-health

# Set it to 'production' when deploying
NODE_ENV=development

# Optional, Just for local development
PORT=5000
HOST_URL='http://localhost'

# DB
MONGO_DB_URI=mongodb://localhost/care-pine-home-health

POSTGRES_DATABASE_URL=
POSTGRES_DATABASE=care-pine-home-health
POSTGRES_DATABASE_USER=postgres
POSTGRES_DATABASE_PASSWORD=

JWT_SECRET=mysupersecretkey
JWT_TIMEOUT=60m
```

Application will check for an `x-token` key value pair in the HTTP header to consider as a Authenticate User.

For MongoDB ORM is https://mongoosejs.com/ & for PostgreSQL ORM is https://sequelize.org/master/

## Heroku Deploy

1. heroku create name-of-the-app
2. heroku config:set NPM_CONFIG_PRODUCTION=false YARN_PRODUCTION=false [To keep dev dependencies]
3. set the value for MONGO_DB_URI
4. heroku addons:create heroku-postgresql:hobby-dev
5. Go to the heroku dashboard settings and copy DATABASE_URL as POSTGRES_DATABASE_URL and set up other variable as above
6. git push heroku master
