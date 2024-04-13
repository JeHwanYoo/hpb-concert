import { Inject, Injectable } from '@nestjs/common'
import { UsersRepository, UsersRepositoryToken } from './users.repository'
import { UserCreationModel, UserModel } from './models/user.model'
import {
  OffsetBasedPaginationQuery,
  OffsetBasedPaginationResult,
} from '../../shared/shared.dto'

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
    return this.usersRepository.create(mutationModel)
  }

  /**
   *
   * @param id
   * @returns found UserModel
   */
  findOne(id: string): Promise<UserModel> {
    return this.usersRepository.findOne(id)
  }

  /**
   *
   * @param query
   * @returns paginated UserModel
   */
  find(
    query: OffsetBasedPaginationQuery,
  ): Promise<OffsetBasedPaginationResult<UserModel>> {
    return this.usersRepository.find(query)
  }
}
