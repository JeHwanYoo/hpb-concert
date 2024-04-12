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

  create(mutationModel: UserCreationModel): Promise<UserModel> {
    return this.usersRepository.create(mutationModel)
  }

  findOne(id: string): Promise<UserModel> {
    return this.usersRepository.findOne(id)
  }

  find(
    query: OffsetBasedPaginationQuery,
  ): Promise<OffsetBasedPaginationResult<UserModel>> {
    return this.usersRepository.find(query)
  }
}
