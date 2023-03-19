import dotenv from 'dotenv'

dotenv.config()

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/devCamper',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE,
    JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE,
}

export default config
