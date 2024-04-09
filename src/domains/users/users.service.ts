import { Inject, Injectable } from '@nestjs/common'
import { UsersRepository, UsersRepositoryToken } from './users.repository'
import { UserMutationModel } from './models/user.mutation.model'
import { UserModel } from './models/user.model'

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepositoryToken)
    private readonly usersRepository: UsersRepository,
  ) {}

  create(mutationModel: UserMutationModel): Promise<string> {
    return this.usersRepository.create(mutationModel)
  }

  findOne(id: string): Promise<UserModel> {
    return
  }
}
