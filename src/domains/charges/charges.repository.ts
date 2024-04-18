import {
  ChargeModel,
  ChargeCreationModel,
  ChargeUpdatingModel,
} from './models/charge.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'

export const ChargesRepositoryToken = 'ChargesRepository'

export interface ChargesRepository<S = unknown> {
  create(creationModel: ChargeCreationModel): Promise<ChargeModel>

  /**
   *
   * @param by
   * @param session
   * @returns Found ChargeModel which matches the given condition
   */
  findOneBy(
    by: IdentifierFrom<ChargeModel>,
    session?: S,
  ): Promise<ChargeModel | null>

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
  ): Promise<ChargeModel | null>
}
