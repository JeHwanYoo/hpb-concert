import {
  SeatCreationModel,
  SeatModel,
  SeatUpdatingModel,
} from './models/seat.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'

export const SeatsRepositoryToken = 'SeatRepository'

export interface SeatsRepository<S = unknown> {
  /**
   *
   * @param creationModel
   * @param session
   * @returns Created SeatModel
   */
  create(creationModel: SeatCreationModel, session?: S): Promise<SeatModel>

  /**
   *
   * @param by
   * @param session
   * @retruns Found SeatModels
   */
  findManyBy(by: Partial<SeatModel>, session?: S): Promise<SeatModel[]>

  /**
   *
   * @param by
   * @param session
   * @returns Found SeatModel or null
   */
  findOneBy(
    by: IdentifierFrom<SeatModel, 'seatNo'>,
    session?: S,
  ): Promise<SeatModel | null>

  /**
   *
   * @param seatId
   * @param updatingModel
   * @param session
   * @returns Updated SeatModel
   */
  update(
    seatId: string,
    updatingModel: SeatUpdatingModel,
    session?: S,
  ): Promise<SeatModel | null>
}
