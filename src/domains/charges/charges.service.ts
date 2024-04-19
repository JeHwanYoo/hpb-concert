import { Inject, Injectable } from '@nestjs/common'
import { ChargesRepository, ChargesRepositoryToken } from './charges.repository'
import {
  ChargeCreationModel,
  ChargeModel,
  ChargeUpdatingModel,
} from './models/charge.model'
import {
  TransactionLevel,
  TransactionService,
  TransactionServiceToken,
} from '../../shared/transaction/transaction.service'
import { IdentifierFrom } from '../../shared/shared.type.helper'

@Injectable()
export class ChargesService {
  constructor(
    @Inject(ChargesRepositoryToken)
    private chargesRepository: ChargesRepository,
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
   */
  findOneByUserId(by: IdentifierFrom<ChargeModel>): Promise<ChargeModel> {
    return this.chargesRepository.findOneBy(by)()
  }

  /**
   *
   * @param id
   * @param chargeModel
   * @returns charged ChargeModel
   */
  charge(id: string, chargeModel: ChargeUpdatingModel): Promise<ChargeModel> {
    return this.transactionService.tx<ChargeModel>(
      TransactionLevel.ReadCommitted,
      [
        async conn => {
          const beforeCharging = await this.chargesRepository.findOneBy({
            id,
          })(conn)

          return this.chargesRepository.update(id, {
            userId: chargeModel.userId,
            amount: beforeCharging.amount + chargeModel.amount,
          })(conn)
        },
      ],
    )
  }

  /**
   *
   * @param id
   * @param useModel
   * @returns used ChargeModel
   * @throws Error Insufficient balance
   */
  use(id: string, useModel: ChargeUpdatingModel): Promise<ChargeModel> {
    return this.transactionService.tx<ChargeModel>(
      TransactionLevel.ReadCommitted,
      [
        async conn => {
          const beforeCharging = await this.chargesRepository.findOneBy({ id })(
            conn,
          )

          const balance = beforeCharging.amount - useModel.amount

          if (balance < 0) {
            throw new Error('Insufficient balance')
          }

          return this.chargesRepository.update(id, {
            userId: useModel.userId,
            amount: balance,
          })(conn)
        },
      ],
    )
  }
}
