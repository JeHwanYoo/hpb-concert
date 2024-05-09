import { Inject, Injectable } from '@nestjs/common'
import { UserRepository, UsersRepositoryToken } from './user.repository'
import { UserCreationModel, UserModel } from './model/user.model'
import {
  OffsetBasedPaginationQuery,
  OffsetBasedPaginationResult,
} from '../../shared/shared.dto'
import { IdentifierFrom } from '../../shared/shared.type.helper'
import { NotFoundDomainException } from '../../shared/shared.exception'

@Injectable()
export class UserService {
  constructor(
    @Inject(UsersRepositoryToken)
    private readonly usersRepository: UserRepository,
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
   * @throws NotFoundDomainException
   */
  async findOneBy(by: IdentifierFrom<UserModel>): Promise<UserModel> {
    const foundUserModel = this.usersRepository.findOneBy(by)()

    if (!foundUserModel) {
      throw new NotFoundDomainException()
    }

    return foundUserModel
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
