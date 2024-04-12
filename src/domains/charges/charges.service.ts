import { Inject, Injectable } from '@nestjs/common'
import { ChargesRepository, ChargesRepositoryToken } from './charges.repository'
import { ChargeUpdatingModel } from './models/charge.model'

@Injectable()
export class ChargesService {
  constructor(
    @Inject(ChargesRepositoryToken)
    private chargesRepository: ChargesRepository,
  ) {}

  findOneByUserId(userId: string) {
    return this.chargesRepository.findOneByUserId(userId)
  }

  charge(chargeId: string, updatingModel: ChargeUpdatingModel) {
    return this.chargesRepository.charge(chargeId, updatingModel)
  }

  use(chargeId: string, updatingModel: ChargeUpdatingModel) {
    // todo validation
    return this.chargesRepository.use(chargeId, updatingModel)
  }
}
