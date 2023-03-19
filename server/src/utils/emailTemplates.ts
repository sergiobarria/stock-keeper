interface ResetPasswordTemplateProps {
    username: string
    resetUrl: string
}

export function resetPasswordTemplate(props: ResetPasswordTemplateProps): string {
    const { username, resetUrl } = props

    return `
        <div>
            <h2>Hello ${username}</h2>
            <p>You have requested to reset your password</p>
            <p>Please click the link below to reset your password</p>
            <a href="${resetUrl}">${resetUrl}</a>

            <p>Note: This link will expire in 10 minutes</p>

            <p>If you did not request a password reset, please ignore this email</p>
        </div>
    `
}
