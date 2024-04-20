import { PrismaService } from '../../prisma/prisma.service'
import { ConcertsRepository } from '../../../domains/concerts/concerts.repository'
import {
  ConcertCreationModel,
  ConcertModel,
} from '../../../domains/concerts/models/concert.model'
import { Injectable } from '@nestjs/common'
import { TransactionalOperation } from '../../../shared/transaction/transaction.service'
import { IdentifierFrom } from '../../../shared/shared.type.helper'
import { Prisma } from '@prisma/client'

@Injectable()
export class ConcertsPrismaRepository implements ConcertsRepository {
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
