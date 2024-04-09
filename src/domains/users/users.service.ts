import { Inject, Injectable } from '@nestjs/common'
import { UsersRepository, UsersRepositoryToken } from './users.repository'

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepositoryToken)
    private readonly usersRepository: UsersRepository,
  ) {}
}
