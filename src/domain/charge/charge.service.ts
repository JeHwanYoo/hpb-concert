import { Inject, Injectable } from '@nestjs/common'
import { ChargeRepository, ChargeRepositoryToken } from './charge.repository'
import {
  ChargeCreationModel,
  ChargeModel,
  ChargeUpdatingModel,
} from './model/charge.model'
import {
  TransactionLevel,
  TransactionService,
  TransactionServiceToken,
} from '../../service/transaction/transaction.service'
import { IdentifierFrom } from '../../shared/shared.type.helper'
import {
  DomainException,
  NotFoundDomainException,
} from '../../shared/shared.exception'

@Injectable()
export class ChargeService {
  constructor(
    @Inject(ChargeRepositoryToken)
    private chargeRepository: ChargeRepository,
    @Inject(TransactionServiceToken)
    private readonly transactionService: TransactionService,
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

  charge(
    userId: string,
    updatingModel: ChargeUpdatingModel,
  ): Promise<ChargeModel> {
    return this.transactionService.tx<ChargeModel>(
      TransactionLevel.ReadCommitted,
      [
        async conn => {
          const beforeCharging = await this.chargeRepository.findOneBy({
            userId,
          })(conn)

          if (!beforeCharging) {
            throw new NotFoundDomainException()
          }

          return this.chargeRepository.update(userId, {
            amount: beforeCharging.amount + updatingModel.amount,
          })(conn)
        },
      ],
    )
  }

  use(
    userId: string,
    updatingModel: ChargeUpdatingModel,
  ): Promise<ChargeModel> {
    return this.transactionService.tx<ChargeModel>(
      TransactionLevel.ReadCommitted,
      [
        async conn => {
          const beforeCharging = await this.chargeRepository.findOneBy({
            userId,
          })(conn)

          if (!beforeCharging) {
            throw new NotFoundDomainException()
          }

          const balance = beforeCharging.amount - updatingModel.amount

          if (balance < 0) {
            throw new DomainException('Insufficient balance')
          }

          return this.chargeRepository.update(userId, {
            amount: balance,
          })(conn)
        },
      ],
    )
  }
}
