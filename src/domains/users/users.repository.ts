import { UserModel } from './models/user.model'
import { UserMutationModel } from './models/user.mutation.model'
import {
  OffsetBasedPaginationQuery,
  OffsetBasedPaginationResult,
} from '../../shared/shared.dto'

export const UsersRepositoryToken = 'UsersRepository'

export interface UsersRepository {
  /**
   *
   * @param mutationModel to create
   * @returns The UUID that was created
   */
  create(mutationModel: UserMutationModel): Promise<string>

  /**
   *
   * @param id User's id
   * @returns The UserModel that matched
   */
  findOne(id: string): Promise<UserModel>

  /**
   *
   * @param query
   * @returns The paginated result of the query
   */
  find(
    query: OffsetBasedPaginationQuery,
  ): Promise<OffsetBasedPaginationResult<UserModel>>

  /**
   *
   * @param id User's id
   * @param mutationModel to update
   * @returns The UUID that was updated
   */
  update(id: string, mutationModel: UserMutationModel): Promise<string>

  /**
   *
   * @params User's id
   * @returns The UUID that was removed
   */
  remove(id: string): Promise<string>
}
