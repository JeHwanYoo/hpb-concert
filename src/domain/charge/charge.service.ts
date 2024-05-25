import { Inject, Injectable } from '@nestjs/common'
import { ChargeRepository, ChargeRepositoryToken } from './charge.repository'
import {
  ChargeCreationModel,
  ChargeModel,
  ChargeUpdatingModel,
} from './model/charge.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'
import {
  DomainException,
  NotFoundDomainException,
} from '../../shared/shared.exception'
import { LockService, LockServiceToken } from '../../shared/lock/lock.service'

@Injectable()
export class ChargeService {
  constructor(
    @Inject(ChargeRepositoryToken)
    private chargeRepository: ChargeRepository,
    @Inject(LockServiceToken)
    private readonly lockService: LockService,
  ) {}

  create(creationModel: ChargeCreationModel): Promise<ChargeModel> {
    return this.chargeRepository.create(creationModel)()
  }

  findOneBy(by: IdentifierFrom<ChargeModel>): Promise<ChargeModel> {
    const foundChargeModel = this.chargeRepository.findOneBy(by)()

    if (!foundChargeModel) {
      throw new NotFoundDomainException()
    }

    return foundChargeModel
  }

  async charge(
    userId: string,
    updatingModel: ChargeUpdatingModel,
  ): Promise<ChargeModel> {
    const lockKey = 'charge' + userId

    try {
      if (!(await this.lockService.acquireLock(lockKey))) {
        throw new DomainException('AcquireLockError')
      }

      const beforeCharging = await this.chargeRepository.findOneBy({
        userId,
      })()

      if (!beforeCharging) {
        throw new NotFoundDomainException()
      }

      return await this.chargeRepository.update(userId, {
        amount: beforeCharging.amount + updatingModel.amount,
      })()
    } finally {
      await this.lockService.releaseLock(lockKey)
    }
  }

  async use(
    userId: string,
    updatingModel: ChargeUpdatingModel,
  ): Promise<ChargeModel> {
    const lockKey = 'charge' + userId

    try {
      if (!(await this.lockService.acquireLock(lockKey))) {
        throw new DomainException('AcquireLockError')
      }

      const beforeCharging = await this.chargeRepository.findOneBy({
        userId,
      })()

      if (!beforeCharging) {
        throw new NotFoundDomainException()
      }

      const balance = beforeCharging.amount - updatingModel.amount

      if (balance < 0) {
        throw new DomainException('Insufficient balance')
      }

      return await this.chargeRepository.update(userId, {
        amount: balance,
      })()
    } finally {
      await this.lockService.releaseLock(lockKey)
    }
  }
}
