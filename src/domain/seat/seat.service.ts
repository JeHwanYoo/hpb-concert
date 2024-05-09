import { Inject, Injectable } from '@nestjs/common'
import { SeatRepository, SeatsRepositoryToken } from './seat.repository'
import { SeatCreationModel, SeatModel } from './model/seat.model'
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
import { LockService, LockServiceToken } from '../../shared/lock/lock.service'
import { v4 } from 'uuid'

const lockKey = 'lock_key'

@Injectable()
export class SeatService {
  constructor(
    @Inject(SeatsRepositoryToken)
    private readonly seatsRepository: SeatRepository,
    @Inject(TransactionServiceToken)
    private readonly transactionService: TransactionService,
    @Inject(LockServiceToken)
    private readonly lockService: LockService,
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
  async reserve(
    reservationModel: Omit<
      SeatCreationModel,
      'reservedAt' | 'deadline' | 'paidAt'
    >,
  ): Promise<SeatModel> {
    const reservedAt = new Date()
    const deadline = addMinutes(reservedAt, 5)

    const lockValue = v4()

    if (!(await this.lockService.acquireLock(lockKey, lockValue))) {
      throw new DomainException('AcquireLockError')
    }

    return this.transactionService.tx(TransactionLevel.ReadCommitted, [
      async conn => {
        try {
          const beforeReserving = await this.seatsRepository.findOneBy({
            seatNo: reservationModel.seatNo,
          })(conn)

          if (
            beforeReserving?.reservedAt &&
            differenceInMinutes(new Date(), beforeReserving.deadline) < 5
          ) {
            throw new DomainException('Already reserved')
          }

          if (beforeReserving?.paidAt) {
            throw new DomainException('Already paid')
          }

          if (beforeReserving?.deadline) {
            return this.seatsRepository.update(beforeReserving.id, {
              ...reservationModel,
              reservedAt,
              deadline,
            })(conn)
          }

          return await this.seatsRepository.create({
            ...reservationModel,
            reservedAt,
            deadline,
          })(conn)
        } finally {
          await this.lockService.releaseLock(lockKey, lockValue)
        }
      },
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
  async pay(id: string, userId: string): Promise<SeatModel> {
    const lockValue = v4()
    if (!(await this.lockService.acquireLock(lockKey, lockValue))) {
      throw new DomainException('AcquireLockError')
    }

    return this.transactionService.tx<SeatModel>(
      TransactionLevel.ReadCommitted,
      [
        async conn => {
          try {
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

            return await this.seatsRepository.update(id, {
              paidAt: new Date(),
            })(conn)
          } finally {
            await this.lockService.releaseLock(lockKey, lockValue)
          }
        },
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
