import { SeatsRepository } from '../../../domains/seats/seats.repository'
import {
  SeatCreationModel,
  SeatModel,
  SeatUpdatingModel,
} from '../../../domains/seats/models/seat.model'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IdentifierFrom } from '../../../shared/shared.type.helper'
import { Prisma } from '@prisma/client'
import { TransactionalOperation } from '../../../shared/transaction/transaction.service'

@Injectable()
export class SeatsPrismaRepository implements SeatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(creationModel: SeatCreationModel): TransactionalOperation<SeatModel> {
    return () =>
      this.prisma.seat.create({
        data: creationModel,
      })
  }

  findManyBy(by: Partial<SeatModel>): TransactionalOperation<SeatModel[]> {
    return () =>
      this.prisma.seat.findMany({
        where: by as Prisma.SeatWhereUniqueInput,
      })
  }

  findOneBy(
    by: IdentifierFrom<SeatModel, 'seatNo'>,
  ): TransactionalOperation<SeatModel | null> {
    return () =>
      this.prisma.seat.findUnique({
        where: by as Prisma.SeatWhereUniqueInput,
      })
  }

  update(
    seatId: string,
    updatingModel: SeatUpdatingModel,
  ): TransactionalOperation<SeatModel | null> {
    return async () => {
      const { holderId, ...rest } = updatingModel
      try {
        return await this.prisma.seat.update({
          where: {
            id: seatId,
            holderId,
          },
          data: rest,
        })
      } catch (e) {
        // todo logging
        return null
      }
    }
  }
}
