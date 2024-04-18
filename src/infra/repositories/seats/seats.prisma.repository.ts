import { SeatsRepository } from '../../../domains/seats/seats.repository'
import {
  SeatCreationModel,
  SeatModel,
  SeatUpdatingModel,
} from '../../../domains/seats/models/seat.model'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IdentifierFrom } from '../../../shared/shared.type.helper'

@Injectable()
export class SeatsPrismaRepository implements SeatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(creationModel: SeatCreationModel): Promise<SeatModel> {
    return this.prisma.seat.create({
      data: creationModel,
    })
  }

  findManyBy(by: Partial<SeatModel>, session?: unknown): Promise<SeatModel[]> {
    return Promise.resolve([])
  }

  findOneBy(
    by: IdentifierFrom<SeatModel, 'seatNo'>,
  ): Promise<SeatModel | null> {
    return Promise.resolve(undefined)
  }

  update(seatId: string, updatingModel: SeatUpdatingModel): Promise<SeatModel> {
    return Promise.resolve(undefined)
  }
}
