require('dotenv').config();

module.exports = {
    client: 'pg',
    version: '7.2',
    connection: {
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations: {
      directory: './migrations',
    }
};