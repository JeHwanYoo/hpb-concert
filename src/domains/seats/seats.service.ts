import { Inject, Injectable } from '@nestjs/common'
import { SeatsRepository, SeatsRepositoryToken } from './seats.repository'
import { SeatCreationModel, SeatModel } from './models/seat.model'
import { addMinutes, differenceInMinutes } from 'date-fns'
import {
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
   * @description
   * create the seat when user reserve it
   */
  reserve(
    reservationModel: Omit<
      SeatCreationModel,
      'reservedAt' | 'deadline' | 'paidAt'
    >,
  ): Promise<SeatModel> {
    return this.transactionService.tx<SeatModel>(async connectingSession => {
      const beforeReserving = await this.seatsRepository.findOneBy({
        seatNo: reservationModel.seatNo,
      })

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
    })
  }

  /**
   *
   * @param id
   * @param userId
   * @returns paid SeatModel
   */
  pay(id: string, userId: string): Promise<SeatModel> {
    return this.transactionService.tx<SeatModel>(async connectingSession => {
      const beforePaying = await this.seatsRepository.findOneBy({ id })

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
        id,
        { paidAt: new Date() },
        connectingSession,
      )
    })
  }

  /**
   *
   * @param by
   * @returns found SeatModels
   */
  findManyBy(by: Partial<SeatModel>): Promise<SeatModel[]> {
    return this.seatsRepository.findManyBy(by)
  }

  /**
   *
   * @param by
   * @returns found SeatModel
   */
  findOneBy(by: IdentifierFrom<SeatModel, 'seatNo'>): Promise<SeatModel> {
    return this.seatsRepository.findOneBy(by)
  }
}
