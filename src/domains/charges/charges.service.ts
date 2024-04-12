import { Inject, Injectable } from '@nestjs/common'
import { ChargesRepository, ChargesRepositoryToken } from './charges.repository'
import { ChargeModel, ChargeOrUseModel } from './models/charge.model'

@Injectable()
export class ChargesService {
  constructor(
    @Inject(ChargesRepositoryToken)
    private chargesRepository: ChargesRepository,
  ) {}

  findOneByUserId(userId: string) {
    return this.chargesRepository.findOneByUserId(userId)
  }

  charge(chargeId: string, chargeModel: ChargeOrUseModel) {
    return this.chargesRepository.withTransaction<ChargeModel>(
      async connectingSession => {
        const beforeCharging = await this.chargesRepository.findOneByChargeId(
          chargeId,
          connectingSession,
        )

        return this.chargesRepository.charge(
          chargeId,
          { balance: beforeCharging.balance + chargeModel.amount },
          connectingSession,
        )
      },
    )
  }

  use(chargeId: string, useModel: ChargeOrUseModel) {
    return this.chargesRepository.withTransaction<ChargeModel>(
      async connectingSession => {
        const beforeCharging = await this.chargesRepository.findOneByChargeId(
          chargeId,
          connectingSession,
        )

        const balance = beforeCharging.balance - useModel.amount

        if (balance < 0) {
          throw new Error('Insufficient balance')
        }

        return this.chargesRepository.use(
          chargeId,
          {
            balance,
          },
          connectingSession,
        )
      },
    )
  }
}
