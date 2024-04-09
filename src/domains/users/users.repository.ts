import { UserModel } from './models/user.model'
import { UserMutationModel } from './models/user.mutation.model'

export const UsersRepositoryToken = 'UsersRepository'

export interface UsersRepository {
  create(mutationModel: UserMutationModel): string

  findOne(id: string): UserModel

  findAll(): UserModel[]

  update(id: string, mutationModel: UserMutationModel): string

  remove(id: string): string
}
