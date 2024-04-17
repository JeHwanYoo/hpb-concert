import { ConcertCreationModel, ConcertModel } from './models/concert.model'

export const ConcertsRepositoryToken = 'ConcertsRepository'

export interface ConcertsRepository<S = unknown> {
  /**
   *
   * @param creationModel
   * @param session
   * @returns Created ConcertModel
   */
  create(
    creationModel: ConcertCreationModel,
    session?: S,
  ): Promise<ConcertModel>

  /**
   *
   * @param by
   * @param session
   * @returns Found ConcertModels
   */
  findManyBy(by: Partial<ConcertModel>, session?: S): Promise<ConcertModel[]>
}
