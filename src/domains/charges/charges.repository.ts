import { ChargeModel, ChargeUpdatingModel } from './models/charge.model'

export const ChargesRepositoryToken = 'ChargesRepository'

export interface ChargesRepository {
  findOneByUserId(userId: string): Promise<ChargeModel>

  charge(
    chargeId: string,
    updatingModel: ChargeUpdatingModel,
  ): Promise<ChargeModel>

  use(
    chargeId: string,
    updatingModel: ChargeUpdatingModel,
  ): Promise<ChargeModel>
}
