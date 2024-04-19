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
import { IdentifierFrom } from '../../../shared/shared.type.helper'
import { TransactionalOperation } from '../../../shared/transaction/transaction.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param createModel to create
   * @returns The UUID that was created
   */
  create(
    createModel: UserCreationModel,
  ): TransactionalOperation<UserModel, PrismaService> {
    return connection =>
      (connection ?? this.prisma).user.create({
        data: createModel,
      })
  }

  /**
   *
   * @param by
   * @returns The paginated result of the query
   *
   * Please be aware, the 'total' might not always be accurate as data may change between fetching the data and counting it.
   * This is an accepted trade-off for better performance.
   */
  findManyBy(
    by: Partial<UserModel> & OffsetBasedPaginationQuery,
  ): TransactionalOperation<
    OffsetBasedPaginationResult<UserModel>,
    PrismaService
  > {
    return async connection => {
      const { page, size } = by
      const skip = (page - 1) * size

      const items = await (connection ?? this.prisma).user.findMany({
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

      const total = await (connection ?? this.prisma).user.count()

      return {
        total,
        items,
      }
    }
  }

  /**
   *
   * @param by
   * @returns The UserModel that matched
   */
  findOneBy(
    by: IdentifierFrom<UserModel>,
  ): TransactionalOperation<UserModel | null, PrismaService> {
    return connection =>
      (connection ?? this.prisma).user.findUnique({
        where: by as Prisma.UserWhereUniqueInput,
      })
  }
}
