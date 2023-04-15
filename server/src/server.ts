import * as http from 'http'

import config from 'config'
import chalk from 'chalk'

import { app } from './app'
import { logger } from './utils'

let server: http.Server

const port = config.get<string>('PORT')
const env = config.get<string>('NODE_ENV')

async function main(): Promise<void> {
    server = http.createServer(app)

    // connect to database here 👇🏼

    try {
        server.listen(port, () => {
            logger.info(chalk.blueBright.bold.underline(`⇨ 🚀 Server running in ${env} mode on port ${port}`))
        })
    } catch (err: any) {
        logger.error(chalk.redBright.bold.underline(`⇨ ❌ Server error: ${err.message}`))
        process.exit(1)
    }
}

function shutdown(): void {
    logger.info(chalk.magentaBright.bold.underline('⇨ 🔴 Shutting down server...'))
    void server.close()
    // prisma.$disconnect().finally(() => {
    //     process.exit(0)
    // })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

void main()
