import { Inject, Injectable } from '@nestjs/common'
import { ChargesRepository, ChargesRepositoryToken } from './charges.repository'
import { ChargeModel, ChargeOrUseModel } from './models/charge.model'
import {
  TransactionService,
  TransactionServiceToken,
} from '../../shared/transaction/transaction.service'

@Injectable()
export class ChargesService {
  constructor(
    @Inject(ChargesRepositoryToken)
    private chargesRepository: ChargesRepository,
    @Inject(TransactionServiceToken)
    private readonly transactionService: TransactionService,
  ) {}

  /**
   *
   * @param userId
   * @returns found ChargeModel
   */
  findOneByUserId(userId: string): Promise<ChargeModel> {
    return this.chargesRepository.findOneBy(userId)
  }

  /**
   *
   * @param chargeId
   * @param chargeModel
   * @returns charged ChargeModel
   */
  charge(
    chargeId: string,
    chargeModel: ChargeOrUseModel,
  ): Promise<ChargeModel> {
    return this.transactionService.tx<ChargeModel>(async connectingSession => {
      const beforeCharging = await this.chargesRepository.findOneByChargeId(
        chargeId,
        connectingSession,
      )

      return this.chargesRepository.update(
        chargeId,
        { balance: beforeCharging.balance + chargeModel.amount },
        connectingSession,
      )
    })
  }

  /**
   *
   * @param chargeId
   * @param useModel
   * @returns used ChargeModel
   * @throws Error Insufficient balance
   */
  use(chargeId: string, useModel: ChargeOrUseModel): Promise<ChargeModel> {
    return this.transactionService.tx<ChargeModel>(async connectingSession => {
      const beforeCharging = await this.chargesRepository.findOneByChargeId(
        chargeId,
        connectingSession,
      )

      const balance = beforeCharging.balance - useModel.amount

      if (balance < 0) {
        throw new Error('Insufficient balance')
      }

      return this.chargesRepository.update(
        chargeId,
        {
          balance,
        },
        connectingSession,
      )
    })
  }
}
