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

@Injectable()
export class SeatsPrismaRepository implements SeatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(creationModel: SeatCreationModel): Promise<SeatModel> {
    return this.prisma.seat.create({
      data: creationModel,
    })
  }

  findManyBy(by: Partial<SeatModel>): Promise<SeatModel[]> {
    return this.prisma.seat.findMany({
      where: by as Prisma.SeatWhereUniqueInput,
    })
  }

  findOneBy(
    by: IdentifierFrom<SeatModel, 'seatNo'>,
  ): Promise<SeatModel | null> {
    return this.prisma.seat.findUnique({
      where: by as Prisma.SeatWhereUniqueInput,
    })
  }

  update(seatId: string, updatingModel: SeatUpdatingModel): Promise<SeatModel> {
    return this.prisma.seat.update({
      where: {
        id: seatId,
      },
      data: updatingModel,
    })
  }
}
