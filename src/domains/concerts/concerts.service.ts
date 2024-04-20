import { Inject, Injectable } from '@nestjs/common'
import { ConcertCreationModel, ConcertModel } from './models/concert.model'
import {
  ConcertsRepository,
  ConcertsRepositoryToken,
} from './concerts.repository'
import { IdentifierFrom } from '../../shared/shared.type.helper'

@Injectable()
export class ConcertsService {
  constructor(
    @Inject(ConcertsRepositoryToken)
    private readonly concertsRepository: ConcertsRepository,
  ) {}

  /**
   *
   * @param creationModel
   * @returns created ConcertModel
   */
  create(creationModel: ConcertCreationModel): Promise<ConcertModel> {
    return this.concertsRepository.create(creationModel)()
  }

  /**
   *
   * @param by
   * @returns found ConcertModel
   */
  findManyBy(by: Partial<ConcertModel>): Promise<ConcertModel[]> {
    return this.concertsRepository.findManyBy(by)()
  }

  /**
   *
   * @param by
   * @returns found Concert
   */
  findOneBy(by: IdentifierFrom<ConcertModel>): Promise<ConcertModel> {
    return this.concertsRepository.findOneBy(by)()
  }
}
