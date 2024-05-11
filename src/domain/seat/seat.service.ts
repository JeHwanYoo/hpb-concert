import { Inject, Injectable } from '@nestjs/common'
import { SeatRepository, SeatsRepositoryToken } from './seat.repository'
import { SeatModel, SeatReservationModel } from './model/seat.model'
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

  async reserve(reservationModel: SeatReservationModel): Promise<SeatModel> {
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

          if (differenceInMinutes(new Date(), beforeReserving?.deadline) < 5) {
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

  async pay(seatId: string, holderId: string): Promise<SeatModel> {
    const lockValue = v4()
    if (!(await this.lockService.acquireLock(lockKey, lockValue))) {
      throw new DomainException('AcquireLockError')
    }

    return this.transactionService.tx<SeatModel>(
      TransactionLevel.ReadCommitted,
      [
        async conn => {
          try {
            const beforePaying = await this.seatsRepository.findOneBy({
              id: seatId,
            })(conn)

            if (!beforePaying) {
              throw new DomainException('Not Reserved')
            }

            if (beforePaying.holderId !== holderId) {
              throw new DomainException('Not Authorized')
            }

            if (differenceInMinutes(new Date(), beforePaying.deadline) > 5) {
              throw new DomainException('Deadline Exceeds')
            }

            if (beforePaying.paidAt) {
              throw new DomainException('Already paid')
            }

            return await this.seatsRepository.update(seatId, {
              paidAt: new Date(),
            })(conn)
          } finally {
            await this.lockService.releaseLock(lockKey, lockValue)
          }
        },
      ],
    )
  }

  findManyBy(by: Partial<SeatModel>): Promise<SeatModel[]> {
    return this.seatsRepository.findManyBy(by)()
  }

  async findOneBy(by: IdentifierFrom<SeatModel, 'seatNo'>): Promise<SeatModel> {
    const foundSeatModel = await this.seatsRepository.findOneBy(by)()

    if (foundSeatModel === null) {
      throw new NotFoundDomainException()
    }

    return foundSeatModel
  }
}
