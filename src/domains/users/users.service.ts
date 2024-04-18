import { Inject, Injectable } from '@nestjs/common'
import { UsersRepository, UsersRepositoryToken } from './users.repository'
import { UserCreationModel, UserModel } from './models/user.model'
import {
  OffsetBasedPaginationQuery,
  OffsetBasedPaginationResult,
} from '../../shared/shared.dto'
import { IdentifierFrom } from '../../shared/shared.type.helper'

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepositoryToken)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   *
   * @param mutationModel
   * @returns created UserModel
   */
  create(mutationModel: UserCreationModel): Promise<UserModel> {
    return this.usersRepository.create(mutationModel)()
  }

  /**
   *
   * @param by
   * @returns found UserModel
   */
  findOneBy(by: IdentifierFrom<UserModel>): Promise<UserModel> {
    return this.usersRepository.findOneBy(by)()
  }

  /**
   *
   * @param by
   * @returns paginated UserModel
   */
  findManyByOffset(
    by: Partial<UserModel> & OffsetBasedPaginationQuery,
  ): Promise<OffsetBasedPaginationResult<UserModel>> {
    return this.usersRepository.findManyBy(by)()
  }
}
