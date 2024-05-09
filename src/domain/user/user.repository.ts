import { UserCreationModel, UserModel } from './model/user.model'
import {
  OffsetBasedPaginationQuery,
  OffsetBasedPaginationResult,
} from '../../shared/shared.dto'
import { IdentifierFrom } from '../../shared/shared.type.helper'
import { TransactionalOperation } from '../../shared/transaction/transaction.service'

export const UsersRepositoryToken = 'UsersRepository'

export interface UserRepository<Connection = unknown> {
  /**
   *
   * @param createModel
   * @returns The UUID that was created
   */
  create(
    createModel: UserCreationModel,
  ): TransactionalOperation<UserModel, Connection>

  /**
   *
   * @param by
   * @returns The UserModel that matched
   */
  findOneBy(
    by: IdentifierFrom<UserModel>,
  ): TransactionalOperation<UserModel | null, Connection>

  /**
   *
   * @param by
   * @returns The paginated result of the query
   */
  findManyBy(
    by: Partial<UserModel> & OffsetBasedPaginationQuery,
  ): TransactionalOperation<OffsetBasedPaginationResult<UserModel>, Connection>
}
