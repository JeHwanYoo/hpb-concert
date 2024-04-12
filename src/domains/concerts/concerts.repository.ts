import { ConcertCreationModel, ConcertModel } from './models/concert.model'

export const ConcertsRepositoryToken = 'ConcertsRepository'

export interface ConcertsRepository {
  create(creationModel: ConcertCreationModel): Promise<ConcertModel>

  find(): Promise<ConcertModel[]>
}
