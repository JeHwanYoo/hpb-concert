import { Inject, Injectable } from '@nestjs/common'
import { SeatsRepository, SeatsRepositoryToken } from './seats.repository'
import { SeatCreationModel, SeatModel } from './models/seat.model'
import { addMinutes, differenceInMinutes } from 'date-fns'

@Injectable()
export class SeatsService {
  constructor(
    @Inject(SeatsRepositoryToken)
    private readonly seatsRepository: SeatsRepository,
  ) {}

  /**
   *
   * @param reservationModel
   * @returns reserved SeatModel
   * @description
   * create the seat when user reserve it
   */
  reserve(
    reservationModel: Omit<
      SeatCreationModel,
      'reservedAt' | 'deadline' | 'paidAt'
    >,
  ): Promise<SeatModel> {
    return this.seatsRepository.withTransaction<SeatModel>(
      async connectingSession => {
        const beforeReserving = await this.seatsRepository.findOneBySeatNo(
          reservationModel.seatNo,
        )

        if (
          beforeReserving.reservedAt !== null &&
          differenceInMinutes(new Date(), beforeReserving.deadline) < 5
        ) {
          throw new Error('Already reserved')
        }

        if (beforeReserving.paidAt !== null) {
          throw new Error('Already paid')
        }

        const reservedAt = new Date()
        const deadline = addMinutes(reservedAt, 5)
        return this.seatsRepository.create(
          {
            ...reservationModel,
            reservedAt,
            deadline,
          },
          connectingSession,
        )
      },
    )
  }

  /**
   *
   * @param seatId
   * @param userId
   * @returns paid SeatModel
   */
  pay(seatId: string, userId: string): Promise<SeatModel> {
    return this.seatsRepository.withTransaction<SeatModel>(
      async connectingSession => {
        const beforePaying = await this.seatsRepository.findOneBySeatId(seatId)

        if (!beforePaying) {
          throw new Error('Not Reserved')
        }

        if (beforePaying.holderId !== userId) {
          throw new Error('Not Authorized')
        }

        if (differenceInMinutes(new Date(), beforePaying.deadline) > 5) {
          throw new Error('Deadline Exceeds')
        }

        if (beforePaying.paidAt !== null) {
          throw new Error('Already paid')
        }

        return this.seatsRepository.update(
          seatId,
          { paidAt: new Date() },
          connectingSession,
        )
      },
    )
  }

  /**
   *
   * @param concertId
   * @returns found SeatModel
   */
  find(concertId: string): Promise<SeatModel[]> {
    return this.seatsRepository.find(concertId)
  }

  /**
   *
   * @param seatNo
   * @returns found SeatModel
   */
  findOneBySeatNo(seatNo: number): Promise<SeatModel> {
    return this.seatsRepository.findOneBySeatNo(seatNo)
  }
}
