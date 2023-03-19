import type { FilterQuery } from 'mongoose'
import { User, type UserModel, type IUser } from '../models/user.model'
import type { UpdateUserType } from '../schemas/user.schemas'

export async function createUser(input: IUser): Promise<UserModel> {
    return await User.create(input)
}

export async function findUsers(): Promise<UserModel[]> {
    return await User.find({})
}

export async function findUser(query: FilterQuery<IUser>): Promise<UserModel | null> {
    return await User.findOne(query).select('+password')
}

export async function findUserById(id: string): Promise<UserModel | null> {
    return await User.findById(id).select('+password')
}

export async function updateUser(id: string, input: Partial<UpdateUserType>): Promise<UserModel | null> {
    return await User.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
    })
}
