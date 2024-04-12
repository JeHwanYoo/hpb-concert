import { ChargeModel, ChargeUpdatingModel } from './models/charge.model'

export const ChargesRepositoryToken = 'ChargesRepository'

export interface ChargesRepository {
  findOneByUserId(userId: string): Promise<ChargeModel>

  findOneByChargeId<S = unknown>(
    chargeId: string,
    connectingSession?: S,
  ): Promise<ChargeModel>

  charge<S = unknown>(
    chargeId: string,
    updatingModel: ChargeUpdatingModel,
    connectingSession: S,
  ): Promise<ChargeModel>

  use<S = unknown>(
    chargeId: string,
    updatingModel: ChargeUpdatingModel,
    connectingSession: S,
  ): Promise<ChargeModel>

  withTransaction<T, S = unknown>(
    cb: (connectingSession: S) => Promise<T>,
  ): Promise<T>
}
