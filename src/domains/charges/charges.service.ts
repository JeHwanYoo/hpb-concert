import { Inject, Injectable } from '@nestjs/common'
import { ChargesRepository, ChargesRepositoryToken } from './charges.repository'
import {
  ChargeModel,
  ChargeCreationModel,
  ChargeOrUseModel,
} from './models/charge.model'
import {
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
    return this.chargesRepository.create(creationModel)
  }

  /**
   *
   * @param by
   * @returns found ChargeModel
   */
  findOneByUserId(by: IdentifierFrom<ChargeModel>): Promise<ChargeModel> {
    return this.chargesRepository.findOneBy(by)
  }

  /**
   *
   * @param id
   * @param chargeModel
   * @returns charged ChargeModel
   */
  charge(id: string, chargeModel: ChargeOrUseModel): Promise<ChargeModel> {
    return this.transactionService.tx<ChargeModel>(async connectingSession => {
      const beforeCharging = await this.chargesRepository.findOneBy(
        {
          id,
        },
        connectingSession,
      )

      return this.chargesRepository.update(
        id,
        { amount: beforeCharging.amount + chargeModel.amount },
        connectingSession,
      )
    })
  }

  /**
   *
   * @param id
   * @param useModel
   * @returns used ChargeModel
   * @throws Error Insufficient balance
   */
  use(id: string, useModel: ChargeOrUseModel): Promise<ChargeModel> {
    return this.transactionService.tx<ChargeModel>(async connectingSession => {
      const beforeCharging = await this.chargesRepository.findOneBy(
        { id },
        connectingSession,
      )

      const balance = beforeCharging.amount - useModel.amount

      if (balance < 0) {
        throw new Error('Insufficient balance')
      }

      return this.chargesRepository.update(
        id,
        {
          amount: balance,
        },
        connectingSession,
      )
    })
  }
}
