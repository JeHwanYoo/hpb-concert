import { Inject, Injectable } from '@nestjs/common'
import { ConcertCreationModel, ConcertModel } from './model/concert.model'
import {
  ConcertRepository,
  ConcertsRepositoryToken,
} from './concert.repository'
import { IdentifierFrom } from '../../shared/shared.type.helper'

@Injectable()
export class ConcertService {
  constructor(
    @Inject(ConcertsRepositoryToken)
    private readonly concertsRepository: ConcertRepository,
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
