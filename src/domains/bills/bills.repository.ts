import { BillCreationModel, BillModel } from './models/bill.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'

export const BillsRepositoryToken = 'BillsRepository'

export interface BillsRepository<S = unknown> {
  /**
   *
   * @param creationModel
   * @param session
   * @returns Created BillModel
   */
  create(creationModel: BillCreationModel, session?: S): Promise<BillModel>

  /**
   *
   * @param by
   * @param session
   * @returns Found BillModel which matches the given condition
   */
  findOneBy(
    by: IdentifierFrom<BillModel>,
    session?: S,
  ): Promise<BillModel | null>
}
