import { Schema, model, type CallbackError, type Document } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

export interface IUser {
    name: string
    email: string
    password?: string
    passwordConfirm?: string
    photo?: string
    phone?: string
    bio?: string
    passwordChangedAt?: Date
}

export interface IUserMethods {
    comparePasswords: (candidatePassword: string, userPassword: string) => Promise<boolean>
    changedPasswordAfter: (JWTTimestamp: number) => boolean
}

export type UserModel = IUser & IUserMethods & Document

const userSchema = new Schema<UserModel>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            validate: [validator.isEmail, 'Invalid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Password confirmation is required'],
            validate: {
                validator: function (this: IUser, el: string) {
                    return el === this.password
                },
                message: 'Passwords do not match',
            },
        },
        photo: {
            type: String,
            default: 'https://i.ibb.co./4pDNDk1/avatar.png',
        },
        phone: String,
        bio: {
            type: String,
            maxlength: [500, 'Bio must be less than 500 characters'],
        },
        passwordChangedAt: Date,
    },
    { timestamps: true, versionKey: false }
)

// ======== Instance Methods ========
userSchema.methods.comparePasswords = async function (candidatePassword: string, userPassword: string) {
    const isMatch = await bcrypt.compare(candidatePassword, userPassword)

    return isMatch
}

// Check if password was changed after the token was issued
userSchema.methods.changedPasswordAfter = function (this: UserModel, JWTTimestamp: number) {
    if (this.passwordChangedAt !== undefined) {
        const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10) // Convert to seconds

        return JWTTimestamp < changedTimestamp
    }

    // False means NOT changed
    return false
}

// ======== Pre Save Middlewares ========
userSchema.pre<UserModel>(/save/, async function (next: (error?: CallbackError) => void) {
    if (!this.isModified('password')) return next() // Only run this function if password was modified

    if (this.password !== undefined) {
        this.password = await bcrypt.hash(this.password, 12)
    }

    this.passwordConfirm = undefined

    next()
})

export const User = model<UserModel>('User', userSchema)
