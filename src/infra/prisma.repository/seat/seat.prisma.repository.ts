import { SeatRepository } from '../../../domain/seat/seat.repository'
import {
  SeatCreationModel,
  SeatModel,
  SeatUpdatingModel,
} from '../../../domain/seat/model/seat.model'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.connection/prisma.service'
import { IdentifierFrom } from '../../../shared/shared.type.helper'
import { Prisma } from '@prisma/client'
import { TransactionalOperation } from '../../../shared/transaction/transaction.service'

@Injectable()
export class SeatPrismaRepository implements SeatRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    creationModel: SeatCreationModel,
  ): TransactionalOperation<SeatModel, PrismaService> {
    return connection =>
      (connection ?? this.prisma).seat.create({
        data: creationModel,
      })
  }

  findManyBy(
    by: Partial<SeatModel>,
  ): TransactionalOperation<SeatModel[], PrismaService> {
    return connection =>
      (connection ?? this.prisma).seat.findMany({
        where: by as Prisma.SeatWhereUniqueInput,
      })
  }

  findOneBy(
    by: IdentifierFrom<SeatModel, 'seatNo'>,
  ): TransactionalOperation<SeatModel | null, PrismaService> {
    return connection =>
      (connection ?? this.prisma).seat.findUnique({
        where: by as Prisma.SeatWhereUniqueInput,
      })
  }

  update(
    seatNo: number,
    updatingModel: SeatUpdatingModel,
  ): TransactionalOperation<SeatModel, PrismaService> {
    return connection => {
      return (connection ?? this.prisma).seat.update({
        where: {
          seatNo,
        },
        data: updatingModel,
      })
    }
  }
}
