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
import {
  DomainException,
  NotFoundDomainException,
} from '../../shared/shared.exception'

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
   * @throws DomainException Already reserved
   * @throws DomainException Already paid
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
          throw new DomainException('Already reserved')
        }

        if (beforeReserving.paidAt !== null) {
          throw new DomainException('Already paid')
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
   * @throws DomainException Not Reserved
   * @throws DomainException Not Authorized
   * @throws DomainException Deadline Exceeds
   * @throws DomainException Already paid
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
            throw new DomainException('Not Reserved')
          }

          if (beforePaying.holderId !== userId) {
            throw new DomainException('Not Authorized')
          }

          if (differenceInMinutes(new Date(), beforePaying.deadline) > 5) {
            throw new DomainException('Deadline Exceeds')
          }

          if (beforePaying.paidAt !== null) {
            throw new DomainException('Already paid')
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
   * @throws NotFoundDomainException
   */
  async findOneBy(by: IdentifierFrom<SeatModel, 'seatNo'>): Promise<SeatModel> {
    const foundSeatModel = await this.seatsRepository.findOneBy(by)()

    if (foundSeatModel === null) {
      throw new NotFoundDomainException()
    }

    return foundSeatModel
  }
}
