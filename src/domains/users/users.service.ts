import { Inject, Injectable } from '@nestjs/common'
import { UsersRepository, UsersRepositoryToken } from './users.repository'
import { UserMutationModel } from './models/user.mutation.model'

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepositoryToken)
    private readonly usersRepository: UsersRepository,
  ) {}

  create(mutationModel: UserMutationModel): Promise<string> {
    return this.usersRepository.create(mutationModel)
  }
}
