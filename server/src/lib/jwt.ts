import jwt from 'jsonwebtoken'
import config from 'config'

// use this script to generate a new secret key for JWT
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"

export function generateJWTToken(id: string): string {
    const secret = config.get<string>('JWT_SECRET')
    const expiresIn = config.get<string>('JWT_EXPIRES_IN')

    const payload = { id }
    return jwt.sign(payload, secret, { expiresIn })
}
