import { SeatsRepository } from '../../../domains/seats/seats.repository'
import {
  SeatCreationModel,
  SeatModel,
  SeatUpdatingModel,
} from '../../../domains/seats/models/seat.model'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class SeatsPrismaRepository implements SeatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(creationModel: SeatCreationModel): Promise<SeatModel> {
    return Promise.resolve(undefined)
  }

  findManyByConcertId(concertId: string): Promise<SeatModel[]> {
    return Promise.resolve([])
  }

  findOneById(seatId: string): Promise<SeatModel | null> {
    return Promise.resolve(undefined)
  }

  findOneBySeatNo(seatNo: number): Promise<SeatModel> {
    return Promise.resolve(undefined)
  }

  update(seatId: string, updatingModel: SeatUpdatingModel): Promise<SeatModel> {
    return Promise.resolve(undefined)
  }
}
