import * as http from 'http'

import chalk from 'chalk'
import dotenv from 'dotenv'
import config from 'config'

import { app } from './app'
import { logger, connectToMongoDB } from './lib'

dotenv.config()

let server: http.Server
const PORT = config.get<number>('PORT')
const NODE_ENV = config.get<string>('NODE_ENV')

// Handle uncaught exceptions globally
process.on('uncaughtException', err => {
    logger.error('Uncaught exception:', err)
    server.close(() => process.exit(1))
})

// Handle unhandled promise rejections globally
process.on('unhandledRejection', err => {
    logger.error('Unhandled rejection:', err)
    server.close(() => process.exit(1))
})

async function main(): Promise<void> {
    server = http.createServer(app)

    await connectToMongoDB()

    try {
        server.listen(PORT, () => {
            logger.info(chalk.greenBright.bold.underline(`Server running in ${NODE_ENV} mode on port ${PORT} 🚀`))
        })
    } catch (error: any) {
        logger.error(chalk.redBright.bold.underline(`Error: ${error.message}`))
        process.exit(1)
    }
}

void main()
