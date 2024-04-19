import { ConcertCreationModel, ConcertModel } from './models/concert.model'
import { TransactionalOperation } from '../../shared/transaction/transaction.service'

export const ConcertsRepositoryToken = 'ConcertsRepository'

export interface ConcertsRepository<Connection = unknown> {
  /**
   *
   * @param creationModel
   * @returns Created ConcertModel
   */
  create(
    creationModel: ConcertCreationModel,
  ): TransactionalOperation<ConcertModel, Connection>

  /**
   *
   * @param by
   * @returns Found ConcertModels
   */
  findManyBy(
    by: Partial<ConcertModel>,
  ): TransactionalOperation<ConcertModel[], Connection>
}
