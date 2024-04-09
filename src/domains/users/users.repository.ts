import { UserModel } from './models/user.model'
import { UserMutationModel } from './models/user.mutation.model'
import {
  OffsetBasedPaginationQuery,
  OffsetBasedPaginationResult,
} from '../../shared/shared.dto'

export const UsersRepositoryToken = 'UsersRepository'

export interface UsersRepository {
  create(mutationModel: UserMutationModel): Promise<string>

  findOne(id: string): Promise<UserModel>

  find(
    query: OffsetBasedPaginationQuery,
  ): Promise<OffsetBasedPaginationResult<UserModel>>

  update(id: string, mutationModel: UserMutationModel): Promise<string>

  remove(id: string): Promise<string>
}
