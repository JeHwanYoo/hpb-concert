import { PrismaService } from '../../prisma/prisma.service'
import { ConcertsRepository } from '../../../domains/concerts/concerts.repository'
import {
  ConcertCreationModel,
  ConcertModel,
} from '../../../domains/concerts/models/concert.model'

export class ConcertsPrismaRepository implements ConcertsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(creationModel: ConcertCreationModel): Promise<ConcertModel> {
    return Promise.resolve(undefined)
  }

  find(): Promise<ConcertModel[]> {
    return Promise.resolve([])
  }
}
