import { Inject, Injectable } from '@nestjs/common'
import { SeatsRepository, SeatsRepositoryToken } from './seats.repository'
import { SeatCreationModel, SeatModel } from './models/seat.model'
import { addMinutes, differenceInMinutes } from 'date-fns'
import {
  TransactionLevel,
  TransactionService,
  TransactionServiceToken,
} from '../../shared/transaction/transaction.service'
import { IdentifierFrom } from '../../shared/shared.type.helper'

@Injectable()
export class SeatsService {
  constructor(
    @Inject(SeatsRepositoryToken)
    private readonly seatsRepository: SeatsRepository,
    @Inject(TransactionServiceToken)
    private readonly transactionService: TransactionService,
  ) {}

  /**
   *
   * @param reservationModel
   * @returns reserved SeatModel
   * @throws Error Already reserved
   * @throws Error Already paid
   * @description
   * create the seat when user reserve it
   */
  reserve(
    reservationModel: Omit<
      SeatCreationModel,
      'reservedAt' | 'deadline' | 'paidAt'
    >,
  ): Promise<SeatModel> {
    const reservedAt = new Date()
    const deadline = addMinutes(reservedAt, 5)

    return this.transactionService.tx(TransactionLevel.ReadCommitted, [
      async conn => {
        const beforeReserving = await this.seatsRepository.findOneBy({
          seatNo: reservationModel.seatNo,
        })(conn)

        if (
          beforeReserving.reservedAt !== null &&
          differenceInMinutes(new Date(), beforeReserving.deadline) < 5
        ) {
          throw new Error('Already reserved')
        }

        if (beforeReserving.paidAt !== null) {
          throw new Error('Already paid')
        }
      },
      this.seatsRepository.create({
        ...reservationModel,
        reservedAt,
        deadline,
      }),
    ])
  }

  /**
   *
   * @param id
   * @param userId
   * @returns paid SeatModel
   * @throws Error Not Reserved
   * @throws Error Not Authorized
   * @throws Error Deadline Exceeds
   * @throws Error Already paid
   */
  pay(id: string, userId: string): Promise<SeatModel> {
    return this.transactionService.tx<SeatModel>(
      TransactionLevel.ReadCommitted,
      [
        async conn => {
          const beforePaying = await this.seatsRepository.findOneBy({ id })(
            conn,
          )

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
        },
        this.seatsRepository.update(id, { paidAt: new Date() }),
      ],
    )
  }

  /**
   *
   * @param by
   * @returns found SeatModels
   */
  findManyBy(by: Partial<SeatModel>): Promise<SeatModel[]> {
    return this.seatsRepository.findManyBy(by)()
  }

  /**
   *
   * @param by
   * @returns found SeatModel
   * @throws Error Not Found
   */
  async findOneBy(by: IdentifierFrom<SeatModel, 'seatNo'>): Promise<SeatModel> {
    const foundSeatModel = await this.seatsRepository.findOneBy(by)()

    if (foundSeatModel === null) {
      throw new Error('Not Found')
    }

    return foundSeatModel
  }
}
