import mongoose from 'mongoose'
import config from 'config'
import chalk from 'chalk'

import { logger } from './logger'

const MONGO_URI = config.get<string>('MONGO_URI')

export async function connectToMongoDB(): Promise<void> {
    try {
        const conn = await mongoose.connect(MONGO_URI, {})
        logger.info(
            chalk.magentaBright.bold.underline(`Connected to MongoDB: ${conn.connection.host}:${conn.connection.port}`)
        )
    } catch (error: any) {
        logger.error(chalk.redBright.bold.underline(`Error: ${error.message}`))
        process.exit(1)
    }
}
