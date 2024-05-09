import { ConcertCreationModel, ConcertModel } from './model/concert.model'
import { TransactionalOperation } from '../../service/transaction/transaction.service'
import { IdentifierFrom } from '../../shared/shared.type.helper'

export const ConcertsRepositoryToken = 'ConcertsRepository'

export interface ConcertRepository<Connection = unknown> {
  create(
    creationModel: ConcertCreationModel,
  ): TransactionalOperation<ConcertModel, Connection>

  findManyBy(
    by: Partial<ConcertModel>,
  ): TransactionalOperation<ConcertModel[], Connection>

  findOneBy(
    by: IdentifierFrom<ConcertModel>,
  ): TransactionalOperation<ConcertModel, Connection>
}
