import nodemailer from 'nodemailer'
import config from 'config'

interface MailOptions {
    from?: string
    to: string
    subject: string
    text?: string
    html?: string
}

const EMAIL_HOST = config.get<string>('EMAIL_HOST')
const EMAIL_PORT = config.get<number>('EMAIL_PORT')
const EMAIL_USERNAME = config.get<string>('EMAIL_USERNAME')
const EMAIL_PASSWORD = config.get<string>('EMAIL_PASSWORD')

export async function sendEmail(options: MailOptions): Promise<void> {
    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        auth: {
            user: EMAIL_USERNAME,
            pass: EMAIL_PASSWORD,
        },
    })

    const mailOptions = {
        from: options.from ?? 'Admin <admin@stockkeeper.com>',
        to: options.to,
        subject: options.subject,
        text: options.text ?? '',
        html: options.html ?? '',
    }

    await transporter.sendMail(mailOptions)
}
