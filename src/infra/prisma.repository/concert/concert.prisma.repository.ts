import { PrismaService } from '../../prisma.connection/prisma.service'
import {
  ConcertCreationModel,
  ConcertModel,
} from '../../../domain/concert/model/concert.model'
import { Injectable } from '@nestjs/common'
import { TransactionalOperation } from '../../../shared/transaction/transaction.service'
import { IdentifierFrom } from '../../../shared/shared.type.helper'
import { Prisma } from '@prisma/client'
import { ConcertRepository } from '../../../domain/concert/concert.repository'

@Injectable()
export class ConcertPrismaRepository implements ConcertRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param creationModel
   * @returns Created Concert
   */
  create(
    creationModel: ConcertCreationModel,
  ): TransactionalOperation<ConcertModel, PrismaService> {
    return connection =>
      (connection ?? this.prisma).concert.create({
        data: creationModel,
      })
  }

  /**
   *
   * @param by
   * @returns Found Concerts
   */
  findManyBy(
    by: Partial<ConcertModel>,
  ): TransactionalOperation<ConcertModel[], PrismaService> {
    return connection =>
      (connection ?? this.prisma).concert.findMany({
        where: by,
      })
  }

  /**
   *
   * @param by
   * @returns Found Concert
   */
  findOneBy(
    by: IdentifierFrom<ConcertModel>,
  ): TransactionalOperation<ConcertModel, PrismaService> {
    return connection =>
      (connection ?? this.prisma).concert.findUnique({
        where: by as Prisma.ConcertWhereUniqueInput,
      })
  }
}
