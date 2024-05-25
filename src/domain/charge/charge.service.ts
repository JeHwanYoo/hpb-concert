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
import { v4 } from 'uuid'

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
    const lockValue = v4()

    if (!(await this.lockService.acquireLock(lockKey, lockValue))) {
      throw new DomainException('AcquireLockError')
    }

    const beforeCharging = await this.chargeRepository.findOneBy({
      userId,
    })()

    if (!beforeCharging) {
      throw new NotFoundDomainException()
    }

    const updatedCharge = await this.chargeRepository.update(userId, {
      amount: beforeCharging.amount + updatingModel.amount,
    })()

    await this.lockService.releaseLock(lockKey, lockValue)

    return updatedCharge
  }

  async use(
    userId: string,
    updatingModel: ChargeUpdatingModel,
  ): Promise<ChargeModel> {
    const lockKey = 'charge' + userId
    const lockValue = v4()

    if (!(await this.lockService.acquireLock(lockKey, lockValue))) {
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

    const updatedCharge = await this.chargeRepository.update(userId, {
      amount: balance,
    })()

    await this.lockService.releaseLock(lockKey, lockValue)

    return updatedCharge
  }
}
