import {
  UserCreationModel,
  UserModel,
  UserUpdatingModel,
} from './models/user.model'
import {
  OffsetBasedPaginationQuery,
  OffsetBasedPaginationResult,
} from '../../shared/shared.dto'
import { IdentifierFrom } from '../../shared/shared.type.helper'

export const UsersRepositoryToken = 'UsersRepository'

export interface UsersRepository<S = unknown> {
  /**
   *
   * @param createModel
   * @param session
   * @returns The UUID that was created
   */
  create(createModel: UserCreationModel, session?: S): Promise<UserModel>

  /**
   *
   * @param by
   * @param session
   * @returns The UserModel that matched
   */
  findOneBy(by: IdentifierFrom<UserModel>, session?: S): Promise<UserModel>

  /**
   *
   * @param by
   * @param session
   * @returns The paginated result of the query
   */
  findManyBy(
    by: Partial<UserModel> & OffsetBasedPaginationQuery,
    session?: S,
  ): Promise<OffsetBasedPaginationResult<UserModel>>

  /**
   *
   * @param id User's id
   * @param updatingModel
   * @param session
   * @returns The UUID that was updated
   */
  update(
    id: string,
    updatingModel: UserUpdatingModel,
    session?: S,
  ): Promise<UserModel>

  /**
   *
   * @param id User's id
   * @param session
   * @returns The UUID that was removed
   */
  remove(id: string, session?: S): Promise<string>
}
