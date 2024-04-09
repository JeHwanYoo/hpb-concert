import { UserModel } from './models/user.model'
import { UserMutationModel } from './models/user.mutation.model'
import {
  OffsetBasedPaginationQuery,
  OffsetBasedPaginationResult,
} from '../../shared/shared.dto'

export const UsersRepositoryToken = 'UsersRepository'

export interface UsersRepository {
  create(mutationModel: UserMutationModel): string

  findOne(id: string): UserModel

  find(
    query: OffsetBasedPaginationQuery,
  ): OffsetBasedPaginationResult<UserModel>

  update(id: string, mutationModel: UserMutationModel): string

  remove(id: string): string
}
