import {
  UserCreationModel,
  UserModel,
} from 'src/domains/users/models/user.model'
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
  async create(mutationModel: UserCreationModel): Promise<UserModel> {
    return this.prisma.user.create({
      data: mutationModel,
    })
  }

  /**
   *
   * @param id User's id
   * @returns The UserModel that matched
   */
  findOne(id: string): Promise<UserModel> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  /**
   *
   * @param query
   * @returns The paginated result of the query
   *
   * Please be aware, the 'total' might not always be accurate as data may change between fetching the data and counting it.
   * This is an accepted trade-off for better performance.
   */
  async find(
    query: OffsetBasedPaginationQuery,
  ): Promise<OffsetBasedPaginationResult<UserModel>> {
    const { page, size } = query
    const skip = (page - 1) * size

    const items = await this.prisma.user.findMany({
      take: size,
      skip,
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          id: 'asc',
        },
      ],
    })

    const total = await this.prisma.user.count()

    return {
      total,
      items,
    }
  }

  /**
   *
   * @param id User's id
   * @param mutationModel to update
   * @returns The UUID that was updated
   */
  update(id: string, mutationModel: UserCreationModel): Promise<UserModel> {
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
