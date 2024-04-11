import { UserModel } from 'src/domains/users/models/user.model'
import { UserMutationModel } from 'src/domains/users/models/user.mutation.model'
import { UsersRepository } from '../../../domains/users/users.repository'
import {
  OffsetBasedPaginationQuery,
  OffsetBasedPaginationResult,
} from 'src/shared/shared.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param mutationModel to create
   * @returns The UUID that was created
   */
  create(mutationModel: UserMutationModel): Promise<string> {
    throw new Error('Method not implemented.')
  }

  /**
   *
   * @param id User's id
   * @returns The UserModel that matched
   */
  findOne(id: string): Promise<UserModel> {
    throw new Error('Method not implemented.')
  }

  /**
   *
   * @param query
   * @returns The paginated result of the query
   */
  find(
    query: OffsetBasedPaginationQuery,
  ): Promise<OffsetBasedPaginationResult<UserModel>> {
    throw new Error('Method not implemented.')
  }

  /**
   *
   * @param id User's id
   * @param mutationModel to update
   * @returns The UUID that was updated
   */
  update(id: string, mutationModel: UserMutationModel): Promise<string> {
    throw new Error('Method not implemented.')
  }

  /**
   *
   * @params User's id
   * @returns The UUID that was removed
   */
  remove(id: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
