import { ChargeModel, ChargeUpdatingModel } from './models/charge.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'

export const ChargesRepositoryToken = 'ChargesRepository'

export interface ChargesRepository<S = unknown> {
  /**
   *
   * @param by
   * @param session
   * @returns Found ChargeModel which matches the given condition
   */
  findOneBy(by: IdentifierFrom<ChargeModel>, session?: S): Promise<ChargeModel>

  /**
   *
   * @param chargeId
   * @param updatingModel
   * @param session
   * @retruns Updated ChargeModel
   */
  update(
    chargeId: string,
    updatingModel: ChargeUpdatingModel,
    session?: S,
  ): Promise<ChargeModel>
}
