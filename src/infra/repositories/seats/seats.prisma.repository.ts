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

  create<S = unknown>(
    creationModel: SeatCreationModel,
    connectingSession: S,
  ): Promise<SeatModel> {
    return Promise.resolve(undefined)
  }

  find(concertId: string): Promise<SeatModel[]> {
    return Promise.resolve([])
  }

  findOneBySeatId<S = unknown>(
    seatId: string,
    connectingSession?: S,
  ): Promise<SeatModel | null> {
    return Promise.resolve(undefined)
  }

  findOneBySeatNo<S = unknown>(
    seatNo: number,
    connectingSession?: S,
  ): Promise<SeatModel> {
    return Promise.resolve(undefined)
  }

  update<S = unknown>(
    seatId: string,
    updatingModel: SeatUpdatingModel,
    connectingSession: S,
  ): Promise<SeatModel> {
    return Promise.resolve(undefined)
  }

  withTransaction<T, S = unknown>(
    cb: (connectingSession: S) => Promise<T>,
  ): Promise<T> {
    return Promise.resolve(undefined)
  }
}
