import { Inject, Injectable } from '@nestjs/common'
import { ChargeRepository, ChargesRepositoryToken } from './charge.repository'
import {
  ChargeCreationModel,
  ChargeModel,
  ChargeUpdatingModel,
} from './model/charge.model'
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
export class ChargeService {
  constructor(
    @Inject(ChargesRepositoryToken)
    private chargesRepository: ChargeRepository,
    @Inject(TransactionServiceToken)
    private readonly transactionService: TransactionService,
  ) {}

  create(creationModel: ChargeCreationModel): Promise<ChargeModel> {
    return this.chargesRepository.create(creationModel)()
  }

  /**
   *
   * @param by
   * @returns found ChargeModel
   * @throws Error Not Found
   */
  findOneBy(by: IdentifierFrom<ChargeModel>): Promise<ChargeModel> {
    const foundChargeModel = this.chargesRepository.findOneBy(by)()

    if (!foundChargeModel) {
      throw new Error('Not Found')
    }

    return foundChargeModel
  }

  /**
   *
   * @param userId
   * @param chargeModel
   * @returns charged ChargeModel
   * @throws NotFoundDomainException
   */
  charge(
    userId: string,
    chargeModel: ChargeUpdatingModel,
  ): Promise<ChargeModel> {
    return this.transactionService.tx<ChargeModel>(
      TransactionLevel.ReadCommitted,
      [
        async conn => {
          const beforeCharging = await this.chargesRepository.findOneBy({
            userId,
          })(conn)

          if (!beforeCharging) {
            throw new NotFoundDomainException()
          }

          return this.chargesRepository.update(userId, {
            amount: beforeCharging.amount + chargeModel.amount,
          })(conn)
        },
      ],
    )
  }

  /**
   *
   * @param userId
   * @param useModel
   * @returns used ChargeModel
   * @throws DomainException Insufficient balance
   * @throws NotFoundDomainException
   */
  use(userId: string, useModel: ChargeUpdatingModel): Promise<ChargeModel> {
    return this.transactionService.tx<ChargeModel>(
      TransactionLevel.ReadCommitted,
      [
        async conn => {
          const beforeCharging = await this.chargesRepository.findOneBy({
            userId,
          })(conn)

          if (!beforeCharging) {
            throw new NotFoundDomainException()
          }

          const balance = beforeCharging.amount - useModel.amount

          if (balance < 0) {
            throw new DomainException('Insufficient balance')
          }

          return this.chargesRepository.update(userId, {
            amount: balance,
          })(conn)
        },
      ],
    )
  }
}
