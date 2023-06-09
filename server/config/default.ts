import dotenv from 'dotenv'

dotenv.config()

export default {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
}
